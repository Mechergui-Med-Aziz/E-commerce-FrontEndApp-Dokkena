import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CartItem } from 'src/app/classes/cart-item';

import { AuthService } from 'src/app/services/auth-service';
import { BasketService } from 'src/app/services/basket-service';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './check-out.html',
  styleUrl: './check-out.scss'
})
export class CheckOut implements OnInit {

  cartItems: CartItem[] = [];

  deliveryFee = 7;

  isLoggedIn = false;


  constructor(
    private basketService: BasketService,
    private router: Router,
    private authService: AuthService
  ) {}


  // ==========================================
  // INITIALISATION
  // ==========================================

  ngOnInit(): void {

    this.cartItems =
      this.basketService.getBasket();


    this.basketService.basketUpdated
      .subscribe(
        (basket: CartItem[]) => {

          this.cartItems = basket;

        }
      );

  }


  // ==========================================
  // AUGMENTER QUANTITÉ
  // ==========================================

  increaseQty(i: number): void {

    const item =
      this.cartItems[i];


    if (!item) {

      return;

    }


    item.quantity++;


    this.basketService.updateQuantity(
      item.product.id,
      item.quantity
    );

  }


  // ==========================================
  // DIMINUER QUANTITÉ
  // ==========================================

  decreaseQty(i: number): void {

    const item =
      this.cartItems[i];


    if (!item) {

      return;

    }


    if (item.quantity > 1) {

      item.quantity--;


      this.basketService.updateQuantity(
        item.product.id,
        item.quantity
      );

    }

  }


  // ==========================================
  // SUPPRIMER PRODUIT
  // ==========================================

  removeItemFromBasket(
    productId: string | number
  ): void {

    this.basketService.removeItem(
      productId
    );

  }


  // ==========================================
  // SOUS-TOTAL
  // ==========================================

  getSubtotal(): number {

    return this.cartItems.reduce(
      (sum, item) => {

        return sum +
          item.product.price *
          item.quantity;

      },
      0
    );

  }


  // ==========================================
  // TOTAL
  // ==========================================

  getTotal(): number {

    if (this.cartItems.length === 0) {

      this.deliveryFee = 0;

    } else {

      this.deliveryFee = 7;

    }


    return (
      this.getSubtotal() +
      this.deliveryFee
    );

  }


  // ==========================================
  // ALLER À LA CONFIRMATION
  // ==========================================

  goToPay(): void {

    if (this.cartItems.length === 0) {

      return;

    }


    this.router.navigate(
      ['/order-confirmation'],
      {
        queryParams: {
          total: this.getTotal()
        }
      }
    );

  }

}