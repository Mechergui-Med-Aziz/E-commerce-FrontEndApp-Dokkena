// angular import
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { CartItem } from 'src/app/classes/cart-item';
import { User } from 'src/app/classes/user';
import { AuthService } from 'src/app/services/auth-service';
import { BasketService } from 'src/app/services/basket-service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule, RouterLink],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit{

 basket:CartItem[]=[];
 user:User

  constructor(private basketService:BasketService,private router:Router,private authService:AuthService) {
    const config = inject(NgbDropdownConfig);

    config.placement = 'bottom-right';
    
  }
  ngOnInit(): void {
    let id=Number(localStorage.getItem("id"));
    this.authService.getUserById(id).subscribe((data: User) => {
      this.user = data;
    });
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

  logOut(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
