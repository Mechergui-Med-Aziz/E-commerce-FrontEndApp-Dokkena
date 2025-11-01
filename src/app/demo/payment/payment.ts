import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BasketService } from 'src/app/services/basket-service';

@Component({
  selector: 'app-payment',
  imports: [CommonModule,RouterModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class Payment {
   
  loading = true;
  paymentSuccess = false;

  constructor(private router: Router,private basketService:BasketService) {
    setTimeout(() => {
      this.basketService.makeBasketEmpty();
      this.paymentSuccess = true; 
    }, 3000);
  }

}
