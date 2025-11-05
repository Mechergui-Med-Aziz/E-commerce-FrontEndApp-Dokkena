import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from 'src/app/classes/cart-item';
import { AuthService } from 'src/app/services/auth-service';
import { BasketService } from 'src/app/services/basket-service';

@Component({
  selector: 'app-check-out',
  imports: [CommonModule, RouterLink],
  templateUrl: './check-out.html',
  styleUrl: './check-out.scss',
  providers: [BasketService,AuthService],
})
export class CheckOut implements OnInit {
  constructor(private basketService:BasketService,private router:Router,private authService:AuthService) {}
  cartItems:CartItem[]=[];
  deliveryFee = 7;
  isLoggedIn=false;

  

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

removeItemFromBasket(productId: string) {
  this.basketService.removeItem(productId);
}

pay(){
  if(this.authService.isAuthenticated()){
    this.router.navigate(['/payment']);
    }
    else{
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
