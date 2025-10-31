import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/classes/cart-item';
import { BasketService } from 'src/app/services/basket-service';

@Component({
  selector: 'app-check-out',
  imports: [CommonModule],
  templateUrl: './check-out.html',
  styleUrl: './check-out.scss'
})
export class CheckOut implements OnInit {
  constructor(private basketService:BasketService) {}
  cartItems:CartItem[]=[];
  deliveryFee = 7;

  

  ngOnInit(){
    this.cartItems = this.basketService.getBasket();
    this.basketService.basketUpdated.subscribe((basket:CartItem[])=>{
      this.cartItems=basket;
    });
  }



increaseQty(i: number) {
  this.cartItems[i].quantity++;
}

decreaseQty(i: number) {
  if (this.cartItems[i].quantity > 1) this.cartItems[i].quantity--;
}

removeItem(i: number) {
  this.cartItems.splice(i, 1);
}

getSubtotal() {
  return this.cartItems
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

getTotal() {
  if(this.cartItems.length===0){
    this.deliveryFee=0;
  }
  return this.getSubtotal() + this.deliveryFee;
}

removeItemFromBasket(productId: number) {
  this.basketService.removeItem(productId);
}

}
