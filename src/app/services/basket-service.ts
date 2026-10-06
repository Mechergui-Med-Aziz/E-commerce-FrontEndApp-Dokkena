import { Injectable } from '@angular/core';
import { CartItem } from '../classes/cart-item';
import { Subject } from 'rxjs';
import { Product } from '../classes/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  basket: CartItem[] = [];

  basketUpdated = new Subject<CartItem[]>();


  constructor() {

    const savedBasket =
      sessionStorage.getItem('basket');

    this.basket = savedBasket
      ? JSON.parse(savedBasket)
      : [];

  }


  // ==========================================
  // RÉCUPÉRER LE PANIER
  // ==========================================

  getBasket(): CartItem[] {

    return [...this.basket];

  }


  // ==========================================
  // AJOUTER AU PANIER
  // ==========================================

  addToBasket(product: Product): boolean {

    const item =
      this.basket.find(
        item => item.product.id === product.id
      );


    if (item) {

      return false;

    }


    this.basket = [
      ...this.basket,
      {
        product: product,
        quantity: 1
      }
    ];


    this.saveBasket();

    return true;

  }


  // ==========================================
  // MODIFIER QUANTITÉ
  // ==========================================

  updateQuantity(
    productId: number,
    quantity: number
  ): void {

    const item =
      this.basket.find(
        item => item.product.id === productId
      );


    if (!item) {

      return;

    }


    if (quantity < 1) {

      quantity = 1;

    }


    item.quantity = quantity;

    this.saveBasket();

  }


  // ==========================================
  // SUPPRIMER UN PRODUIT
  // ==========================================

  removeItem(productId: string | number): void {

    this.basket =
      this.basket.filter(
        item =>
          item.product.id !== Number(productId)
      );


    this.saveBasket();

  }


  // ==========================================
  // VIDER LE PANIER
  // ==========================================

  makeBasketEmpty(): void {

    this.basket = [];

    this.saveBasket();

  }


  // ==========================================
  // SAUVEGARDER LE PANIER
  // ==========================================

  private saveBasket(): void {

    sessionStorage.setItem(
      'basket',
      JSON.stringify(this.basket)
    );


    this.basketUpdated.next([
      ...this.basket
    ]);

  }

}