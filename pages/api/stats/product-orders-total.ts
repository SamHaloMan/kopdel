import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../lib/prisma'

const productOrdersTotalHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  if (req.method === 'GET') {
    res.status(200).json(await getProductOrderTotal(req));
  } else {
    res.status(401).json({
      message: `HTTP method ${req.method} is not supported.`
    });
  }
}

async function getProductOrderTotal(req: NextApiRequest) {
  const total = await prisma.order.count();

  return {
    orders: total
  }
}

export default productOrdersTotalHandler;
