import { OrderItem } from './order-item';
import { OrderStatus } from '../services/order-service';

export interface Order {
  id?: number;

  orderDate?: string;

  orderPrice?: number;

  deliveryFees?: number;

  orderStatus?: OrderStatus;

  buyerName: string;

  email: string;

  phone: string;

  deliveryAddress: string;

  state: string;

  city: string;

  postalCode: string;

  deliveryInstruction?: string;

  items: OrderItem[];
}