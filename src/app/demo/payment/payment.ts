import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BasketService } from 'src/app/services/basket-service';
import { SeoService } from 'src/app/services/seo-service';

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
        this.basketService.makeBasketEmpty();
        this.paymentSuccess = true;
      }, 3000);
    }
  }
}
