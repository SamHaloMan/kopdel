import * as React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { HomeIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

import { productInfoQuery, productRatingQuery } from 'selectors';
import { ProductDetailProps, ProductRatingsProps, starLabels } from 'const';
import { currencyFormat, roundHalf } from 'lib/utils';
import ProductInfoDialog from 'components/v2/ProductDetails/ProductInfoDialog';

export default function ProductInfoSection() {
  const [productDetailsState, setProductDetailsState] = React.useState<
    ProductDetailProps | undefined
  >();
  const editProductDetailDialogRef = React.useRef<HTMLDialogElement>(null);

  const productDetailsLodable = useRecoilValueLoadable(productInfoQuery);

  const handleUpdate = (data: ProductDetailProps) => {
    setProductDetailsState(data);
  };

  switch (productDetailsLodable.state) {
    case 'hasValue':
      const data = productDetailsLodable.contents.content;
      return (
        <>
          <div className='text-sm breadcrumbs'>
            <ul>
              <li>
                <NextLink href='/'>
                  <HomeIcon className='w-4 h-4' />
                  Product
                </NextLink>
              </li>
              <li>
                <BuildingStorefrontIcon className='w-4 h-4' />
                {data.title}
              </li>
            </ul>
          </div>

          <div className='hero h-auto justify-start shadow-xl rounded-box'>
            <div className='hero-content flex-col lg:flex-row'>
              <Image
                src={`https://picsum.photos/seed/${data.id}/200/280`}
                alt={`product image`}
                width={200}
                height={280}
              />
              <div className='flex flex-col gap-2'>
                <h1 className='text-5xl font-bold'>{data.title}</h1>
                <p className='pt-6'>
                  <span className='text-lg font-bold pr-4'>Type:</span>
                  {data.type.replaceAll(`_nbsp_`, ` `).replaceAll(`_amp_`, `&`)}
                </p>
                <p>
                  <span className='text-lg font-bold pr-4'>
                    Product entry date:
                  </span>
                  {new Date(data.stockedAt).toLocaleDateString()}
                </p>
                <p>
                  <span className='text-lg font-bold pr-4'>Price:</span>
                  {`Rp ${currencyFormat(data.price)}`}
                </p>
                <p>
                  <span className='text-lg font-bold pr-4'>In stock:</span>
                  {productDetailsState?.stock || data.stock}
                </p>
                <button
                  className='btn btn-info w-32'
                  onClick={() => {
                    editProductDetailDialogRef.current?.showModal();
                  }}
                >
                  Edit Details
                </button>
              </div>
            </div>
          </div>

          {data && (
            <ProductInfoDialog
              key={`${data.id}-${data.stock}`}
              id='edit_product_detail'
              ref={editProductDetailDialogRef}
              data={data}
              onSuccess={handleUpdate}
            />
          )}
        </>
      );
    case 'loading':
      return (
        <>
          <div className='flex items-center justify-center'>
            <span className='loading loading-bars loading-lg'></span>
          </div>
        </>
      );
    case 'hasError':
      throw productDetailsLodable.contents;
  }
}
