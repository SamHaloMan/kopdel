import * as React from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { homePageProductSumState } from 'atoms'; // Import from atoms
import { homePageQuery } from 'selectors';
import ShoppingItemCard from 'components/v2/Cards/ShoppingItemCard';

export default function ProductList({ page, pageSize }) {
  const productListLoadable = useRecoilValueLoadable(homePageQuery);
  const [homePageProductSum, setHomePageProductSum] = useRecoilState(homePageProductSumState);

  React.useEffect(() => {
    if (productListLoadable.state === 'hasValue') {
      setHomePageProductSum(productListLoadable.contents.total);
    }
  }, [productListLoadable, setHomePageProductSum]);

  if (productListLoadable.state === 'loading') {
    return (
      <div className='flex items-center justify-center'>
        <span className='loading loading-bars loading-lg'></span>
      </div>
    );
  }

  if (productListLoadable.state === 'hasError') {
    throw productListLoadable.contents;
  }

  return (
    <>
      {!!homePageProductSum && (
        <div className='text-sm text-gray-500 pb-4'>
          {`${pageSize * (page - 1) + 1
            } ~ ${pageSize * page > homePageProductSum
              ? homePageProductSum
              : pageSize * page
            } of over ${homePageProductSum} results`
          }
        </div>
      )}
      <div className='grid grid-cols-1 gap-x-2 gap-y-10 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8'>
        {productListLoadable.contents.content.map((product) => (
          <ShoppingItemCard key={product.id} {...product} />
        ))}
      </div>
    </>
  );
}
