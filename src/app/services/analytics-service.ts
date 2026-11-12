import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface AnalyticsItem {
  item_id: string | number;
  item_name: string;
  item_category?: string;
  price?: number;
  quantity?: number;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  private readonly consentStorageKey = 'dokkena_cookie_consent';
  private readonly utmStorageKey = 'dokkena_utm_data';
  private initialized = false;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.captureUtmParams();
      if (this.hasConsent()) {
        this.initGa4();
      }
    }
  }

  hasConsent(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    try {
      return localStorage.getItem(this.consentStorageKey) === 'accepted';
    } catch {
      return false;
    }
  }

  hasAnsweredConsent(): boolean {
    if (!isPlatformBrowser(this.platformId)) return true;
    try {
      return localStorage.getItem(this.consentStorageKey) !== null;
    } catch {
      return true;
    }
  }

  setConsent(granted: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.consentStorageKey, granted ? 'accepted' : 'declined');
    } catch {
      // Ignored
    }

    if (granted) {
      this.initGa4();
      this.pushEvent('consent', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
    } else {
      this.pushEvent('consent', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
  }

  private initGa4(): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) return;
    const gaId = (environment.gaId || '').trim();

    // If gaId is empty, do NOT load external tracking scripts
    if (!gaId) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId, {
      anonymize_ip: true,
      send_page_view: true
    });

    try {
      const script = this.document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      this.document.head.appendChild(script);
      this.initialized = true;
    } catch {
      // Ignore script injection failure
    }
  }

  private captureUtmParams(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utm: Record<string, string> = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
        const val = urlParams.get(key);
        if (val) utm[key] = val;
      });

      if (Object.keys(utm).length > 0) {
        sessionStorage.setItem(this.utmStorageKey, JSON.stringify(utm));
      }
    } catch {
      // Ignored
    }
  }

  getUtmData(): Record<string, string> | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const data = sessionStorage.getItem(this.utmStorageKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private pushEvent(eventName: string, params: Record<string, any> = {}): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.hasConsent()) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params
    });
  }

  // --- E-Commerce Events ---

  trackViewItemList(items: AnalyticsItem[], listName = 'Catalogue'): void {
    this.pushEvent('view_item_list', {
      item_list_name: listName,
      items: items.map((i, index) => ({
        index: index + 1,
        ...i
      }))
    });
  }

  trackViewItem(item: AnalyticsItem): void {
    this.pushEvent('view_item', {
      currency: 'TND',
      value: item.price || 0,
      items: [item]
    });
  }

  trackAddToCart(item: AnalyticsItem): void {
    this.pushEvent('add_to_cart', {
      currency: 'TND',
      value: (item.price || 0) * (item.quantity || 1),
      items: [item]
    });
  }

  trackRemoveFromCart(item: AnalyticsItem): void {
    this.pushEvent('remove_from_cart', {
      currency: 'TND',
      value: (item.price || 0) * (item.quantity || 1),
      items: [item]
    });
  }

  trackBeginCheckout(items: AnalyticsItem[], totalValue: number): void {
    this.pushEvent('begin_checkout', {
      currency: 'TND',
      value: totalValue,
      items
    });
  }

  trackAddPaymentInfo(paymentType: string, totalValue: number): void {
    this.pushEvent('add_payment_info', {
      currency: 'TND',
      value: totalValue,
      payment_type: paymentType
    });
  }

  trackPurchase(orderId: string, items: AnalyticsItem[], totalValue: number, shippingFee = 7): void {
    const utm = this.getUtmData();
    this.pushEvent('purchase', {
      transaction_id: orderId,
      currency: 'TND',
      value: totalValue,
      shipping: shippingFee,
      items,
      ...(utm ? { traffic_attribution: utm } : {})
    });
  }

  trackSignUp(method = 'email'): void {
    this.pushEvent('sign_up', { method });
  }

  trackLogin(method = 'email'): void {
    this.pushEvent('login', { method });
  }

  trackSearch(searchTerm: string): void {
    this.pushEvent('search', { search_term: searchTerm });
  }
}
