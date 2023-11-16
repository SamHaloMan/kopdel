import * as React from 'react';
import { useSnackbar } from 'notistack';

import { useRecoilState } from 'recoil';
import { productTypeListState, homePageQueryState } from 'atoms';
import clsx from 'clsx';

import { SORT_VALUE } from 'const';
import { upperCaseEachWord } from 'lib/utils';
import { fetchProductTypes } from 'lib/http';

export default function ProductTypeMenu() {
  const [loadingProductType, setLoadingProductType] = React.useState(false);

  const [productTypeList, setProductTypeList] = useRecoilState(productTypeListState);
  const [homePageQueryData, setHomePageQueryData] =
    useRecoilState(homePageQueryState);
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    const func = async () => {
      setLoadingProductType(true);
      const res = await fetchProductTypes();
      const { error, content } = res;
      if (error) {
        setLoadingProductType(false);
        enqueueSnackbar(`Error: Fetch Product Types`, {
          variant: 'error',
        });
        return;
      }
      setProductTypeList(content);
      setLoadingProductType(false);
    };
    !productTypeList.length && func();
  }, [productTypeList.length, enqueueSnackbar, setProductTypeList]);

  return (
    <>
      <ul
        tabIndex={0}
        className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
      >
        <li>
          <div className='menu-title'>Product Type</div>
          <ul>
            {productTypeList.map((productType) => (
              <li
                key={productType}
                onClick={() => {
                  setHomePageQueryData({
                    ...homePageQueryData,
                    page: 1,
                    type: productType,
                  });
                }}
              >
                <span
                  className={clsx({
                    active: homePageQueryData.type === productType,
                  })}
                >
                  {productType.replaceAll(`_nbsp_`, ` `).replaceAll(`_amp_`, `&`)}
                </span>
              </li>
            ))}
          </ul>
        </li>

        <li>
          <div className='menu-title'>Order by</div>
          <ul>
            {SORT_VALUE.map((sortType) => (
              <li
                key={sortType}
                onClick={() => {
                  setHomePageQueryData({
                    ...homePageQueryData,
                    page: 1,
                    sort: sortType,
                  });
                }}
              >
                <span
                  className={clsx({
                    active: homePageQueryData?.sort === sortType,
                  })}
                >
                  {upperCaseEachWord(sortType.replaceAll(`_`, ` `))}
                </span>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </>
  );
}
