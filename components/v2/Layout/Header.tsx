import * as React from 'react';
import NextLink from 'next/link';
import {
  Bars3Icon,
  ShoppingCartIcon,
  BookOpenIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

import ProductTypeMenu from 'components/v2/Layout/ProductTypeMenu';
import { shoppingCartState } from 'atoms';
import { useRecoilState } from 'recoil';
import { signIn, signOut, useSession } from "next-auth/react";

import { calcCartItemSum } from 'lib/utils';

export interface HeaderProps {
  hideMenu?: boolean;
}

export default function Header(props: HeaderProps) {
  const { hideMenu } = props;
  const { data: session } = useSession();

  const [shoppingCart, setShoppingCart] = useRecoilState(shoppingCartState);

  return (
    <>
      <div className='navbar bg-base-100 mx-auto max-w-7xl mt-4 shadow-xl rounded-box'>
        <div className='navbar-start'>
          {!hideMenu && (
            <div className='dropdown'>
              <label
                tabIndex={0}
                className='btn btn-ghost btn-circle content-center'
              >
                <Bars3Icon className='w-6 h-6' />
              </label>
              <ProductTypeMenu />
            </div>
          )}
        </div>
        <div className='navbar-center'>
          <NextLink href='/' className='btn btn-ghost normal-case text-xl'>
            <BookOpenIcon className='w-6 h-6' />
            Koperasi Del
          </NextLink>
        </div>
        <div className='navbar-end'>
          <NextLink href='/cart' className='btn btn-ghost btn-circle'>
            <div className='indicator'>
              <ShoppingCartIcon className='w-6 h-6' />
              <span className='badge badge-sm indicator-item'>
                {calcCartItemSum(shoppingCart)}
              </span>
            </div>
          </NextLink>

          {session ? (
            <div className='dropdown dropdown-end'>
              <label tabIndex={0} className='btn btn-ghost btn-circle'>
                <UserIcon className='w-6 h-6' />
              </label>
              <ul tabIndex={0} className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52'>
                <li>
                  <label>{session.user.name}</label>
                </li>
                <li>
                  <label>{session.user.email}</label>
                </li>
                <li>
                  <hr className='dropdown-divider' />
                </li>
                <li>
                  <button className='btn btn-ghost' onClick={() => signOut()}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              {/* <button className='btn btn-ghost' onClick={() => signIn()}>
                Login
              </button> */}
              <NextLink href='/user/login'>
                <label className='btn btn-ghost'>Login</label>
              </NextLink>
              <NextLink href='/user/register'>
                <label className='btn btn-ghost'>Register</label>
              </NextLink>
            </>
          )}
        </div>
      </div>
    </>
  );
}
