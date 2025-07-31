import type { User } from './user';

export interface Category {
  _id?: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  quantity: number;
  price: number;
  createdBy: User | string;
}
