import { Product } from './product';

export interface OrderItem {
  id?: number;
  quantity: number;
  product: Product;
}