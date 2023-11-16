import {
  atom,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  waitForNone,
} from "recoil";
import { productDetailsIdState, homePageQueryState } from "atoms";
import {
  fetchProductDetailsById,
  fetchProductRatingsById,
  fetchProducts,
} from "lib/http";

export const homePageQuery = selector({
  key: "homePage",
  get: async ({ get }) => {
    const { page, size, type, sort } = get(homePageQueryState);
    const response = await fetchProducts({ page, size, type, sort });
    return response;
  },
});

export const productInfoQuery = selector({
  key: "ProductInfoQuery",
  get: async ({ get }) => {
    const productID = get(productDetailsIdState);
    const response = await fetchProductDetailsById(productID);
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

export const productRatingQuery = selector({
  key: "ProductRatingQuery",
  get: async ({ get }) => {
    const productID = get(productDetailsIdState);
    if (!productID) {
      throw new Error('Required productID');
    }
    const response = await fetchProductRatingsById(productID);
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});
