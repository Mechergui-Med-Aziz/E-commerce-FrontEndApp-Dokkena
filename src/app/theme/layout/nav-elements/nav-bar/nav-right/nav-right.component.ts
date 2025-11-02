// angular import
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import screenfull from 'screenfull';
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
export class NavRightComponent implements OnInit, OnDestroy{

 basket:CartItem[]=[];
 user:User
 screenFull = true;

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
    if (screenfull.isEnabled) {
      this.screenFull = screenfull.isFullscreen; // Initialize based on current fullscreen state
      screenfull.on('change', () => {
        this.screenFull = screenfull.isFullscreen;
      });
    }
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
  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle().then(() => {
        this.screenFull = screenfull.isFullscreen;
      });
    }
  }

  ngOnDestroy() {
    if (screenfull.isEnabled) {
      screenfull.off('change', () => {
        this.screenFull = screenfull.isFullscreen;
      });
    }
  }

}
