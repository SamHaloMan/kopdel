import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

import { shoppingCartItemProps, ProductProps, PAGE_SIZE } from "const";

export const homePageProductSumState = atom({
  key: "homePageProductSumState",
  default: 0,
});

export const shoppingCartState = atom<shoppingCartItemProps[]>({
  key: "shoppingCartState",
  default: [],
});

export const productTypeListState = atom<string[]>({
  key: "productTypeListState",
  default: [],
});

export const homePageQueryState = atom({
  key: "homePageQueryState",
  default: { page: 1, type: "", sort: "", size: PAGE_SIZE },
});

export const productDetailsIdState = atom({
  key: "productDetailsIdState",
  default: "",
});

export const currentUserIdState = atom({
  key: "currentUserIdState",
  default: "1",
});
