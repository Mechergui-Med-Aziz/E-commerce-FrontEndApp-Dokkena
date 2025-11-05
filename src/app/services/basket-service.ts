import { Injectable } from '@angular/core';
import { CartItem } from '../classes/cart-item';
import { Subject } from 'rxjs';
import { Product } from '../classes/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  basket: CartItem[]=[];
  basketUpdated= new Subject<CartItem[]>();

  constructor() { this.basket=JSON.parse(sessionStorage.getItem("basket") || "[]");}

  getBasket(): CartItem[] {
    return [...this.basket];
  }

  addToBasket(product: Product) : Boolean{
        const item=this.basket.find(item => item.product.id === product.id);
        if(item){
          return false;
        }
        else{
          
          this.basket=[...this.basket,{product:product, quantity:1}];
        }
        sessionStorage.setItem('basket',JSON.stringify(this.basket));
        this.basketUpdated.next([...this.basket]);
        return true;
      }

      makeBasketEmpty(): void {
        this.basket=[];
        sessionStorage.setItem('basket',JSON.stringify(this.basket));
        this.basketUpdated.next([...this.basket]);
      }

      removeItem(productId: string): void {
        this.basket = this.basket.filter(item => item.product.id !== productId);
        sessionStorage.setItem('basket',JSON.stringify(this.basket));
        this.basketUpdated.next([...this.basket]);
      }


}
