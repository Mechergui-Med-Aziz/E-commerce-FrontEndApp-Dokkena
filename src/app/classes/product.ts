import { Category } from './category';

export interface Product {

  id?: number;

  name: string;

  price: number;

  image?: string | null;

  image2?: string | null;

  image3?: string | null;

  category: Category;

  description: string;

  featured: boolean;

  onSale: boolean;

  rating: number;

  originalPrice: number;
  quantity: number;
}