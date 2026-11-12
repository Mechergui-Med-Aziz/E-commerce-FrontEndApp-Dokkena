import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from 'src/app/classes/cart-item';
import { AuthService } from 'src/app/services/auth-service';
import { BasketService } from 'src/app/services/basket-service';
import { SeoService } from 'src/app/services/seo-service';
import { AnalyticsService } from 'src/app/services/analytics-service';

@Component({
  selector: 'app-check-out',
  imports: [CommonModule, RouterLink],
  templateUrl: './check-out.html',
  styleUrl: './check-out.scss'
})
export class CheckOut implements OnInit {
  private basketService = inject(BasketService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private seoService = inject(SeoService);
  private analyticsService = inject(AnalyticsService);

  cartItems: CartItem[] = [];
  deliveryFee = 7;
  isLoggedIn = false;

  ngOnInit() {
    this.seoService.update({
      title: 'Mon Panier & Commande | Dokkena',
      description: 'Finalisez votre commande sur Dokkena Tunisie. Livraison rapide et paiement sécurisé.',
      path: '/checkout',
      noindex: true
    });

    this.cartItems = this.basketService.getBasket();
    this.basketService.basketUpdated.subscribe((basket: CartItem[]) => {
      this.cartItems = basket;
    });
  }

  isFreeShipping(): boolean {
    return this.basketService.isFreeShipping();
  }

  getRemainingForFreeShipping(): number {
    return this.basketService.getRemainingForFreeShipping();
  }

  getFreeShippingProgress(): number {
    return this.basketService.getFreeShippingProgress();
  }

  increaseQty(i: number) {
    this.cartItems[i].quantity++;
  }

  decreaseQty(i: number) {
    if (this.cartItems[i].quantity > 1) this.cartItems[i].quantity--;
  }

  removeItem(i: number) {
    const item = this.cartItems[i];
    if (item) {
      this.analyticsService.trackRemoveFromCart({
        item_id: item.product.id,
        item_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      });
    }
    this.cartItems.splice(i, 1);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  getTotal(): number {
    if (this.cartItems.length === 0) {
      this.deliveryFee = 0;
      return 0;
    }
    this.deliveryFee = this.isFreeShipping() ? 0 : 7;
    return this.getSubtotal() + this.deliveryFee;
  }

  removeItemFromBasket(productId: string) {
    const item = this.cartItems.find((ci) => String(ci.product.id) === String(productId));
    if (item) {
      this.analyticsService.trackRemoveFromCart({
        item_id: item.product.id,
        item_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      });
    }
    this.basketService.removeItem(productId);
  }

  pay() {
    this.analyticsService.trackBeginCheckout(
      this.cartItems.map((ci) => ({
        item_id: ci.product.id,
        item_name: ci.product.name,
        item_category: ci.product.category,
        price: ci.product.price,
        quantity: ci.quantity
      })),
      this.getTotal()
    );

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/payment']);
    } else {
      this.isLoggedIn = true;
    }
  }

  closeLoginModal() {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  closeModal() {
    this.isLoggedIn = false;
  }
}
