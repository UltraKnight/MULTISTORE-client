import type { CartItem } from './product';
import type { User, UserComment } from './user';

// TODO: fix typo in Canceled (needs update in the backend and database)
export type OrderStatus = 'Pending' | 'Processing' | 'Confirmed' | 'Canceled' | 'Refunded' | 'In transit' | 'Delivered';

export interface Order {
  _id?: string;
  //products, client, orderDate, status
  products?: CartItem[];
  client?: string | User;
  orderDate?: number;
  status?: string; // TODO: create enum
  total?: number;
  comments?: UserComment[];
  createdAt?: string;
  updatedAt?: string;
}
