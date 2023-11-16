import { NextApiRequest, NextApiResponse } from 'next';

import { ProductType } from '@prisma/client';

const productTypes = Object.values(ProductType);

const productTypeListHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<any>
) => {
    if (req.method === 'GET') {
        res.status(200).json(productTypes);
    } else {
        res.status(401).json({
            message: `HTTP method ${req.method} is not supported.`
        });
    }
}

export default productTypeListHandler;
