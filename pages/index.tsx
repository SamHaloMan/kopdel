import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRecoilState } from 'recoil';
import { homePageProductSumState, homePageQueryState } from 'atoms';

import CommonLayout from 'components/v2/Layout';
import { FilteredChips } from 'components/v2/Chips/FilteredChips';
import ProductList from 'components/v2/Cards/ShoppingItemCardList';
import Pagination from 'components/v2/Pagination';
import { PAGE_SIZE } from 'const';

const Home: NextPage = () => {
  const [homePageQueryData, setHomePageQueryData] =
    useRecoilState(homePageQueryState);
  const [homePageProductSum] = useRecoilState(homePageProductSumState);

  const handleClickPagination = (page: number) => {
    setHomePageQueryData({ ...homePageQueryData, page });
  };

  return (
    <>
      <Head>
        <title>KoDel</title>
        <meta name='description' content='Koperasi IT Del' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <CommonLayout>
        {(homePageQueryData.sort || homePageQueryData.type) && (
          <FilteredChips
            data={homePageQueryData}
            onChange={setHomePageQueryData}
          />
        )}
        <ProductList page={homePageQueryData?.page || 1} pageSize={PAGE_SIZE} />
        <div className='flex justify-center pt-6'>
          <Pagination
            currentPage={homePageQueryData?.page || 1}
            pages={Math.round(homePageProductSum / PAGE_SIZE)}
            onClick={handleClickPagination}
          />
        </div>
      </CommonLayout>
    </>
  );
};

export default Home;
