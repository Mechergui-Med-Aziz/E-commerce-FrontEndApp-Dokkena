// angular import
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { CartItem } from 'src/app/classes/cart-item';
import { BasketService } from 'src/app/services/basket-service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit{

 basket:CartItem[]=[];

  constructor(private basketService:BasketService,private router:Router) {
    const config = inject(NgbDropdownConfig);

    config.placement = 'bottom-right';
    
  }
  ngOnInit(): void {
    this.basket=this.basketService.getBasket();
    this.basketService.basketUpdated.subscribe((basket:CartItem[])=>{
      this.basket=basket;
    });
  }

  emptyBasket(){
    this.basketService.makeBasketEmpty();
  }
  goToCheckOut(){
    this.router.navigate(['/checkout']);

  }

}
