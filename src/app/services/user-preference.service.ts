import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../classes/product';

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {
  private platformId = inject(PLATFORM_ID);

  private readonly recentlyViewedKey = 'dokkena_recently_viewed';
  private readonly wishlistKey = 'dokkena_wishlist';

  getRecentlyViewed(): Product[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const data = localStorage.getItem(this.recentlyViewedKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addToRecentlyViewed(product: Product): void {
    if (!isPlatformBrowser(this.platformId) || !product) return;
    try {
      let list = this.getRecentlyViewed();
      list = list.filter((p) => String(p.id) !== String(product.id));
      list.unshift(product);
      if (list.length > 8) {
        list = list.slice(0, 8);
      }
      localStorage.setItem(this.recentlyViewedKey, JSON.stringify(list));
    } catch {
      // Ignored
    }
  }

  getWishlist(): Array<string | number> {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const data = localStorage.getItem(this.wishlistKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  isInWishlist(productId: string | number): boolean {
    const list = this.getWishlist();
    return list.some((id) => String(id) === String(productId));
  }

  toggleWishlist(productId: string | number): boolean {
    if (!isPlatformBrowser(this.platformId) || !productId) return false;
    try {
      const list = this.getWishlist();
      const strId = String(productId);
      const index = list.findIndex((id) => String(id) === strId);
      let added = false;
      if (index > -1) {
        list.splice(index, 1);
        added = false;
      } else {
        list.push(productId);
        added = true;
      }
      localStorage.setItem(this.wishlistKey, JSON.stringify(list));
      return added;
    } catch {
      return false;
    }
  }
}

