import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma'

const buyProductHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<any>
) => {
    if (req.method === 'POST') {
        try {
            const result = await buyProduct(req);
            res.status(result.status).json({
                message: result.message,
                data: result
            });
        } catch (err: any) {
            console.error(err)
            res.status(500).json({
                message: err.message
            })
        }
    } else {
        res.status(401).json({
            message: `HTTP method ${req.method} is not supported.`
        });
    }
}

async function buyProduct(req: NextApiRequest): Promise<any> {
    // Get productID;
    if (typeof req.query.id !== 'string' && typeof req.query.id !== 'number') {
        throw new Error('Invalid parameter `id`.');
    }
    const productId = BigInt(req.query.id);

    // Get quality;
    if (typeof req.query.quality !== 'string' && typeof req.query.quality !== 'number') {
        throw new Error('Invalid parameter `num`.');
    }
    const quality = Math.floor(Number(req.query.quality));
    if (quality <= 0) {
        throw new Error('Parameter `quality` must greater than zero.');
    }

    // TODO: get user ID from context.
    if (typeof req.query.userId !== 'string' && typeof req.query.userId !== 'number') {
        throw new Error('Invalid parameter `userId`.');
    }
    const userId = BigInt(req.query.userId);

    try {
        const result = await prisma.$transaction(async prisma => {
            // Found the product that the user want to purchase.
            const product = await prisma.product.findFirst({
                where: {
                    id: productId
                },
            });

            if (product === undefined || product === null) {
                throw new Error(`Can not found the product <${productId}> that you want to buy.`);
            }

            // Check if has enough products for the user purchase.
            const stock = product.stock;
            if (quality > stock) {
                throw new Error(`Didn't have enough stock of product <${productId}> for your purchase.`);
            }

            // Cost the user balance to buy the product.
            const cost = product?.price.mul(quality).toNumber();
            const purchaser = await prisma.user.update({
                data: {
                    balance: {
                        decrement: cost,
                    },
                },
                where: {
                    id: userId,
                },
            });
            if (purchaser.balance.lt(0)) {
                throw new Error(`User <${userId}> doesn't have enough money to buy product <${productId}>, which need to cost ${cost}.`)
            }

            // Update the product stock.
            const newProduct = await prisma.product.update({
                data: {
                    stock: {
                        decrement: 1,
                    }
                },
                where: {
                    id: productId
                }
            });
            if (newProduct.stock < 0) {
                throw new Error(`The product ${newProduct.stock} is out of stock.`);
            }

            // Generate a new order to record.
            const order = prisma.order.create({
                data: {
                    userId: userId,
                    productId: productId,
                    quality: quality
                }
            })

            return {
                userId: userId,
                productId: productId,
                productTitle: product.title,
                cost: cost,
                remaining: purchaser.balance,
                orderId: order
            };
        });
        return {
            status: 200,
            message: `User <${userId}> buy ${quality} products <${productId}> successfully, cost: ${result.cost}, remain: ${result.remaining} .`,
            data: result
        };
    } catch (err: any) {
        console.error(err);
        return {
            status: 500,
            message: `Failed to buy product ${productId} for user ${userId}: ${err.message}`
        };
    }
}

export default buyProductHandler;
