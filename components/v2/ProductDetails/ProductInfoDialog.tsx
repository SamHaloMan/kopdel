import * as React from 'react';
import { useSnackbar } from 'notistack';

import { ProductDetailProps } from 'const';
import { currencyFormat, checkIsValidInteger } from 'lib/utils';
import { updateProductDetails } from 'lib/http';

export interface ProductInfoDialogProps {
  data: ProductDetailProps;
  id: string;
  onSuccess?: (data: ProductDetailProps) => void;
}

const ProductInfoDialog = React.forwardRef(
  (props: ProductInfoDialogProps, ref: any) => {
    const { data, id, onSuccess } = props;

    const [isStockValid, setIsStockValid] = React.useState<boolean>(true);
    const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
    const [stock, setStock] = React.useState<number>(data.stock);

    const { enqueueSnackbar } = useSnackbar();

    const handleUpdateStock = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      try {
        const isValid = checkIsValidInteger(value);
        if (isValid) {
          setIsStockValid(true);
          setStock(parseInt(value));
        } else {
          throw new Error('Invalid stock value');
        }
      } catch (error) {
        setIsStockValid(false);
      }
    };

    const handleUpdate = async (event: any) => {
      event.preventDefault();

      setIsUpdating(true);
      const res = await updateProductDetails(data.id, {
        stock: stock,
      });
      if (res.error) {
        enqueueSnackbar(`Error: Update product details.`, {
          variant: 'error',
        });
        setIsUpdating(false);
        return;
      }
      enqueueSnackbar(`Product details was updated.`, {
        variant: 'success',
      });
      res.content?.data && onSuccess && onSuccess(res.content.data);
      setIsUpdating(false);

      ref?.current?.close();
    };

    return (
      <dialog id={id} className='modal' ref={ref}>
        <form method='dialog' className='modal-box'>
          <h3 className='font-bold text-lg'>Edit Product Details</h3>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Product Type</span>
            </label>
            <input
              type='text'
              className='input input-sm input-bordered w-full max-w-xs'
              value={data.type}
              disabled
            />
          </div>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Product Title</span>
            </label>
            <input
              type='text'
              className='input input-sm input-bordered w-full max-w-xs'
              value={data.title}
              disabled
            />
          </div>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Product entry Date</span>
            </label>
            <input
              type='text'
              className='input input-sm input-bordered w-full max-w-xs'
              value={new Date(data.stockedAt).toLocaleDateString()}
              disabled
            />
          </div>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Price</span>
            </label>
            <input
              type='text'
              className='input input-sm input-bordered w-full max-w-xs'
              value={`Rp ${currencyFormat(data.price)}`}
              disabled
            />
          </div>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Stock</span>
            </label>
            <input
              type='text'
              className='input input-sm input-bordered w-full max-w-xs'
              defaultValue={data.stock}
              onChange={handleUpdateStock}
            />
            {!isStockValid && (
              <label className='label'>
                <span className='label-text-alt text-xs text-error'>
                  Invalid stock value
                </span>
              </label>
            )}
          </div>
          <div className='modal-action'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn'>Cancel</button>
            <button
              className='btn btn-info'
              disabled={!isStockValid || isUpdating || stock === data.stock}
              onClick={handleUpdate}
            >
              {isUpdating && <span className='loading loading-spinner' />}
              Update
            </button>
          </div>
        </form>
      </dialog>
    );
  }
);

ProductInfoDialog.displayName = 'ProductInfoDialog';

export default ProductInfoDialog;
