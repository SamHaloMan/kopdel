import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../lib/prisma';

const orderDetailHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<any>
) => {
    switch (req.method) {
        case 'GET':
            try {
                res.status(200).json(await getOrderDetail(req));
            } catch (err: any) {
                console.error(err)
                res.status(500).json({
                    message: err.message
                });
            }
            break;
        default:
            res.status(401).json({
                message: `HTTP method ${req.method} is not supported.`
            });
    }
}

async function getOrderDetail(req: NextApiRequest) {
    // Get orderID;
    if (typeof req.query.id !== 'string' && typeof req.query.id !== 'number') {
        throw new Error('Invalid parameter `id`.');
    }
    const orderId = BigInt(req.query.id);

    // Get record by unique identifier.
    const order: any = await prisma.order.findUnique({
        where: {
            id: orderId
        },
        include: {
            user: {
                select: {
                    id: true,
                    nickname: true
                }
            },
            product: true
        },
    });
    
    if (!order) {
        throw new Error('Order not found.');
    }

    return order;
}

export default orderDetailHandler;
