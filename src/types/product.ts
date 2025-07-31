import type { Category } from './category';
import type { User } from './user';

export interface Product {
  _id?: string;
  createdBy?: User | string; // user ID
  name?: string;
  description?: string;
  category?: Category | string; // category ID
  quantity?: number;
  price?: number;
  image_url?: string;
}

export interface CartItem {
  product: Product | string; // product ID
  quantity: number;
  seller: User | string; // user ID of the seller
}
