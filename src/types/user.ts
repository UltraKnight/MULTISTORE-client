import type { Order } from './order';
import type { Product } from './product';

export interface UserAddress {
  phoneConfirmed?: boolean;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  phone: string;
}

export interface UserComment {
  author: User | string;
  comment: string;
  to: User | string;
  _id: string;
  date: string;
}

export interface User {
  _id?: string;
  fullName?: string;
  storeName?: string;
  username?: string;
  email?: string;
  emailConfirmed?: boolean;
  password?: string;
  products?: Product[];
  sales?: Order[];
  purchases?: Order[];
  categories?: string[];
  cart?: { product: Product; quantity: number; _id: string }[]; // I don't remember what is this _id
  billing?: UserAddress;
  shipping?: UserAddress;
  profile_picture?: string;
}
