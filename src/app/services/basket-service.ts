import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../classes/cart-item';
import { Product } from '../classes/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private platformId = inject(PLATFORM_ID);
  basket: CartItem[] = [];
  basketUpdated = new BehaviorSubject<CartItem[]>([]);

  readonly freeShippingThreshold = environment.freeShippingThreshold || 100;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = sessionStorage.getItem('basket');
        this.basket = stored ? JSON.parse(stored) : [];
      } catch {
        this.basket = [];
      }
    } else {
      this.basket = [];
    }
    this.basketUpdated.next([...this.basket]);
  }

  getBasket(): CartItem[] {
    return [...this.basket];
  }

  addToBasket(product: Product, quantity = 1): boolean {
    const existingItem = this.basket.find((item) => String(item.product.id) === String(product.id));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.basket = [...this.basket, { product, quantity }];
    }
    this.persistBasket();
    return true;
  }

  updateQuantity(productId: string | number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(String(productId));
      return;
    }
    const item = this.basket.find((i) => String(i.product.id) === String(productId));
    if (item) {
      item.quantity = quantity;
      this.persistBasket();
    }
  }

  removeItem(productId: string | number): void {
    this.basket = this.basket.filter((item) => String(item.product.id) !== String(productId));
    this.persistBasket();
  }

  makeBasketEmpty(): void {
    this.basket = [];
    this.persistBasket();
  }

  getSubtotal(): number {
    return this.basket.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  getRemainingForFreeShipping(): number {
    const subtotal = this.getSubtotal();
    return Math.max(0, this.freeShippingThreshold - subtotal);
  }

  hasFreeShipping(): boolean {
    return this.getSubtotal() >= this.freeShippingThreshold;
  }

  isFreeShipping(): boolean {
    return this.hasFreeShipping();
  }

  getFreeShippingProgress(): number {
    const subtotal = this.getSubtotal();
    if (this.freeShippingThreshold <= 0) return 100;
    return Math.min(100, Math.round((subtotal / this.freeShippingThreshold) * 100));
  }

  getShippingCost(): number {
    if (this.basket.length === 0 || this.hasFreeShipping()) return 0;
    return 7; // 7 TND standard shipping fee in Tunisia
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  getItemCount(): number {
    return this.basket.reduce((count, item) => count + item.quantity, 0);
  }

  private persistBasket(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        sessionStorage.setItem('basket', JSON.stringify(this.basket));
      } catch (e) {
        console.warn('Unable to persist basket to sessionStorage:', e);
      }
    }
    this.basketUpdated.next([...this.basket]);
  }
}
