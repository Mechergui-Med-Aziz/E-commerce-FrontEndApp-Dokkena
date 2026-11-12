import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BasketService } from 'src/app/services/basket-service';
import { SeoService } from 'src/app/services/seo-service';
import { AnalyticsService } from 'src/app/services/analytics-service';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, RouterModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class Payment implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private basketService = inject(BasketService);
  private seoService = inject(SeoService);
  private analyticsService = inject(AnalyticsService);

  loading = true;
  paymentSuccess = false;

  ngOnInit() {
    this.seoService.update({
      title: 'Paiement Sécurisé | Dokkena',
      description: 'Paiement sécurisé de votre commande sur Dokkena Tunisie.',
      path: '/payment',
      noindex: true
    });

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const cartItems = this.basketService.getBasket();
        const subtotal = cartItems.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
        this.analyticsService.trackPurchase(
          'DOK-' + Math.floor(100000 + Math.random() * 900000),
          cartItems.map((ci) => ({
            item_id: ci.product.id,
            item_name: ci.product.name,
            item_category: ci.product.category,
            price: ci.product.price,
            quantity: ci.quantity
          })),
          subtotal,
          subtotal >= 100 ? 0 : 7
        );
        this.basketService.makeBasketEmpty();
        this.paymentSuccess = true;
      }, 3000);
    }
  }
}
