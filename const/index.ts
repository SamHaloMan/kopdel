export type OwnerType = {
  id: string;
  name: string;
};

export interface ProductProps {
  id: string;
  title: string;
  type: string;
  stockedAt: string;
  stock: number;
  price: string;
  owners: { owner: OwnerType }[];
  averageRating: number;
  ratings: number;
}

export interface shoppingCartItemProps extends ProductProps {
  quantity: number;
}

export type ProductDetailProps = Omit<
  ProductProps,
  'owners' | 'averageRating' | 'ratings'
>;

export interface ProductRatingsProps {
  productId: string;
  userId: string;
  score: number;
  ratedAt: string;
  user: {
    id: string;
    nickname: string;
  };
}

export const starLabels: { [index: string]: string } = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

export const PAGE_SIZE = 6;

export const SORT_VALUE = ['stocked_at', 'price'];
