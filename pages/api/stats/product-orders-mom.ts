import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../lib/prisma'

const productOrderMoMHandler = async (
	req: NextApiRequest,
	res: NextApiResponse<any>
) => {
	if (req.method === 'GET') {
		res.status(200).json(await getProductOrdersMonthOverMonth(req));
	} else {
		res.status(401).json({
			message: `HTTP method ${req.method} is not supported.`
		});
	}
}

async function getProductOrdersMonthOverMonth(req: NextApiRequest) {
	const result = await prisma.$queryRaw`
		WITH orders_group_by_month AS (
			SELECT
				b.type AS product_type,
				DATE_FORMAT(ordered_at, '%Y-%c') AS month,
				COUNT(*) AS orders
			FROM orders o
			LEFT JOIN products b ON o.product_id = b.id
			WHERE b.type IS NOT NULL
			GROUP BY product_type, month
		), acc AS (
			SELECT
				product_type,
				month,
				SUM(orders) OVER(PARTITION BY product_type ORDER BY product_type, month ASC) as acc
			FROM orders_group_by_month
			ORDER BY product_type, month ASC
		)
		SELECT * FROM acc;
	`;

	return {
		result: result
	}
}

export default productOrderMoMHandler;
