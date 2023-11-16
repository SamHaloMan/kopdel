import axios from 'axios';
import { ProductProps, ProductDetailProps, ProductRatingsProps } from 'const';

export async function fetchProducts(data: {
  page?: number;
  size?: number;
  type?: string;
  sort?: string;
}): Promise<{ content: ProductProps[]; total: number; error?: any }> {
  try {
    const queryArray = Object.keys(data).reduce((prev: string[], item) => {
      const value = data[item as keyof typeof data];
      if (value) {
        prev.push(`${item}=${value}`);
      }
      return prev;
    }, []);
    const response = await axios.get(`/api/products?${queryArray.join(`&`)}`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return { error, content: [], total: 0 };
  }
}

export async function fetchProductTypes(): Promise<{
  content: string[];
  error?: any;
}> {
  try {
    const response = await axios.get(`/api/products/types`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data as string[] };
  } catch (error) {
    console.error(error);
    return { error, content: [] };
  }
}

export async function fetchProductDetailsById(id: string): Promise<{
  content: ProductDetailProps;
  error?: any;
}> {
  try {
    const response = await axios.get(`/api/products/${id}`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data as ProductDetailProps };
  } catch (error) {
    console.error(error);
    return { error, content: {} as ProductDetailProps };
  }
}

export async function fetchProductRatingsById(id: string): Promise<{
  content: { content: ProductRatingsProps[]; total: number };
  error?: any;
}> {
  try {
    const response = await axios.get(`/api/products/${id}/ratings`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error, content: { content: [], total: 0 } };
  }
}

export async function updateProductDetails(
  id: string,
  params: Partial<ProductDetailProps>
): Promise<{
  content?: { data: ProductDetailProps; message: string };
  error?: any;
}> {
  try {
    const response = await axios.put(`/api/products/${id}`, params);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function addRatingByProductID(
  productID: string,
  params: {
    score: number;
  }
): Promise<{
  content?: { data: Omit<ProductRatingsProps, 'user'>; message: string };
  error?: any;
}> {
  try {
    const response = await axios.post(`/api/products/${productID}/ratings`, params);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function deleteRating(
  productID: string,
  userID: string
): Promise<{
  content?: { message: string };
  error?: any;
}> {
  try {
    const response = await axios.delete(
      `/api/products/${productID}/ratings?userId=${userID}`
    );
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function buyProduct(
  productID: string,
  params: { userID: string; quality: number }
): Promise<{
  content?: { message: string };
  error?: any;
}> {
  try {
    const response = await axios.post(
      `/api/products/${productID}/buy?userId=${params.userID}&quality=${params.quality}`
    );
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}
