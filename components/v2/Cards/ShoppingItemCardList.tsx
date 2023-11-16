import * as React from 'react';

import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { homePageProductSumState } from 'atoms';
import { homePageQuery } from 'selectors';
import ShoopingItemCard from 'components/v2/Cards/ShoppingItemCard';

export interface ProductListProps {
  page: number;
  pageSize: number;
}

export default function ProductList(props: ProductListProps) {
  const { page, pageSize } = props;
  // const productListLoadable = useRecoilValueLoadable(currentPageIdxQuery);
  const productListLoadable = useRecoilValueLoadable(homePageQuery);
  const [homePageProductSum, setHomePageProductSum] =
    useRecoilState(homePageProductSumState);
  switch (productListLoadable.state) {
    case 'hasValue':
      setHomePageProductSum(productListLoadable.contents.total);
      return (
        <>
          {!!homePageProductSum && (
            <div className='text-sm text-gray-500 pb-4'>{`${
              pageSize * (page - 1) + 1
            } ~ ${
              pageSize * page > homePageProductSum
                ? homePageProductSum
                : pageSize * page
            } of over ${homePageProductSum} results`}</div>
          )}
          <div className='grid grid-cols-1 gap-x-2 gap-y-10 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8'>
            {productListLoadable.contents.content.map((product) => (
              <ShoopingItemCard key={product.id} {...product} />
            ))}
          </div>
        </>
      );
    case 'loading':
      return (
        <div className='flex items-center justify-center'>
          <span className='loading loading-bars loading-lg'></span>
        </div>
      );
    case 'hasError':
      throw productListLoadable.contents;
  }
}
