import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';

import CommonLayout from 'components/v2/Layout';
import { productDetailsIdState } from 'atoms';
import ProductInfoSection from 'components/v2/ProductDetails/ProductInfoSection';
import ProductReviewsSection from 'components/v2/ProductDetails/ProductReviewsSection';

const Product: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [, setProductDetailsId] = useRecoilState(productDetailsIdState);
  // const productDetailsLodable = useRecoilValueLoadable(productDetailsQuery);

  React.useEffect(() => {
    id && setProductDetailsId(id as string);
  }, [id, setProductDetailsId]);

  return (
    <>
      <Head>
        <title>Product Details</title>
        <meta name='description' content='Product Details' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <CommonLayout
        headerProps={{
          hideMenu: true,
        }}
      >
        <ProductInfoSection />
        <ProductReviewsSection />
      </CommonLayout>
    </>
  );
};

export default Product;
