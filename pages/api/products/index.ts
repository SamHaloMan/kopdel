import { NextApiRequest, NextApiResponse } from 'next';

import { ProductType } from '@prisma/client';
import prisma from '../../../lib/prisma'

const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 8;

enum SortType {
  PRICE = 'price',
  STOCKED_AT = 'stockedAt'
};
enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
};
const sortTypes = Object.values(SortType);
const sortOrders = Object.values(SortOrder);
const productTypes = Object.keys(ProductType);

const productListHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  if (req.method === 'GET') {
    // try {
    //   res.status(200).json(await getProductList(req));
    // } catch (err: any) {
    //   console.error(err)
    //   res.status(500).json({
    //     message: err.message
    //   })
    // }
    try {
      const products = await getProductList(req);
      res.status(200).json(products);
    } catch (err) {
      console.error("Failed to fetch product list:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(401).json({
      message: `HTTP method ${req.method} is not supported.`
    });
  }
}

async function getProductList(req: NextApiRequest) {
  // Querying with joins (Many to many relation).
  const query = parseProductListQuery(req.query, true, true);
  const products: any[] = await prisma.product.findMany({
    ...query,
    include: {
      owners: {
        select: {
          owner: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
    },
  });
  const productIds = products.map((b) => b.id);

  

  // Grouping.
  //
  // Calculate the average rating score for the products in the result.
  //
  // Notice: It is more suitable to add column named `average_rating` in products table to store 
  // the average rating score, which can avoid the need to query every time you use it, and 
  // it is easier to implement the sorting feature.
  const productAverageRatings = await prisma.rating.groupBy({
    by: ['productId'],
    _avg: {
      score: true
    },
    where: {
      productId: {
        in: productIds
      }
    },
    orderBy: {
      _avg: {
        score: 'asc'
      }
    }
  });
  for (const rating of productAverageRatings) {
    const index = products.findIndex((b) => b.id === rating.productId);
    products[index].averageRating = rating._avg.score;
  }

  const productCountRatings = await prisma.rating.groupBy({
    by: ['productId'],
    _count: {
      productId: true
    },
    where: {
      productId: {
        in: productIds
      }
    },
    orderBy: {
      _count: {
        productId: 'asc'
      },
    }
  });
  for (const rating of productCountRatings) {
    const index = products.findIndex((b) => b.id === rating.productId);
    products[index].ratings = rating._count.productId;
  }

  // Counting.
  const total = await prisma.product.count(parseProductListQuery(req.query));

  return {
    content: products,
    total: total
  }
}

function parseProductListQuery(query: any, sorting: boolean = false, paging: boolean = false) {
  const q: any = {}

  // Filtering.
  // Reference: https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting
  q.where = {};
  if (typeof query.type === 'string') {
    if (!productTypes.includes(query.type)) {
      throw new Error(`Parameter \`type\` must be one of [${productTypes.join(', ')}].`);
    }
    q.where.type = query.type;
  }

  // Sorting.
  if (sorting) {
    if (sortTypes.includes(query.sort)) {
      let order = SortOrder.ASC;
      if (sortOrders.includes(query.order)) {
        order = query.order
      }

      if (query.sort === SortType.PRICE) {
        q.orderBy = {
          price: order
        };
      } else if (query.sort === SortType.STOCKED_AT) {
        q.orderBy = {
          stockedAt: order
        };
      }
    }
  }

  // Paging.
  if (paging) {
    let page = DEFAULT_PAGE_NUM;
    let size = DEFAULT_PAGE_SIZE;
    if (typeof query.page === 'string') {
      page = parseInt(query.page);
    }
    if (typeof query.size === 'string') {
      size = parseInt(query.size);
    }
    if (size < 0 || size > 100) {
      throw new Error('Parameter `size` must between 0 and 100.');
    }
    q.take = size;
    q.skip = (page - 1) * size;
  }

  return q;
}

export default productListHandler;
