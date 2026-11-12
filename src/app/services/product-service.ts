import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../classes/product';
import { environment } from '../../environments/environment';

export interface ProductQueryParams {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: 'asc' | 'desc';
  q?: string;
  category?: string;
  isOnSale?: boolean;
  isFeatured?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/product`;

  getAllProducts(params?: ProductQueryParams): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params._page !== undefined) httpParams = httpParams.set('_page', params._page.toString());
      if (params._limit !== undefined) httpParams = httpParams.set('_limit', params._limit.toString());
      if (params._sort) httpParams = httpParams.set('_sort', params._sort);
      if (params._order) httpParams = httpParams.set('_order', params._order);
      if (params.q) httpParams = httpParams.set('q', params.q);
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.isOnSale !== undefined) httpParams = httpParams.set('isOnSale', params.isOnSale.toString());
      if (params.isFeatured !== undefined) httpParams = httpParams.set('isFeatured', params.isFeatured.toString());
    }
    return this.http.get<Product[]>(this.apiUrl, { params: httpParams });
  }

  getProductById(id: number | string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsOnSale(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?isOnSale=true`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?isFeatured=true`);
  }

  getProductsByCategory(category: string, params?: ProductQueryParams): Observable<Product[]> {
    let httpParams = new HttpParams().set('category', category);
    if (params) {
      if (params._page !== undefined) httpParams = httpParams.set('_page', params._page.toString());
      if (params._limit !== undefined) httpParams = httpParams.set('_limit', params._limit.toString());
      if (params._sort) httpParams = httpParams.set('_sort', params._sort);
      if (params._order) httpParams = httpParams.set('_order', params._order);
      if (params.q) httpParams = httpParams.set('q', params.q);
    }
    return this.http.get<Product[]>(this.apiUrl, { params: httpParams });
  }

  deleteProduct(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDiscountPercentage(originalPrice: number, price: number): number {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  /**
   * Helper to generate a clean URL slug from product name (e.g., "1-xiaomi-redmi-note-13")
   */
  generateSlug(product: { id: string | number; name: string }): string {
    const cleanName = product.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${product.id}-${cleanName}`;
  }

  /**
   * Helper to extract the numeric/string ID from a slug (e.g., "1-xiaomi-redmi-note-13" -> "1", or "42" -> "42")
   */
  extractIdFromSlug(slugOrId: string): string {
    if (!slugOrId) return '';
    const match = slugOrId.match(/^(\d+)/);
    return match ? match[1] : slugOrId;
  }
}
