import type { User } from './user';

export interface Rate {
  _id?: string
  createdBy: User | string; // user ID
  rate: number;
  comment?: string;
  productId: string; 
}
