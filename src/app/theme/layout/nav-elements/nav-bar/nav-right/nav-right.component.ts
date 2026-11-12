// angular import
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
export class NavRightComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  basket: CartItem[] = [];
  user?: User;
  screenFull = true;

  constructor(
    public basketService: BasketService,
    private router: Router,
    public authService: AuthService
  ) {
    const config = inject(NgbDropdownConfig);
    config.placement = 'bottom-right';
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedId = this.authService.getUserId();
      if (storedId) {
        this.authService.getUserById(storedId).subscribe({
          next: (data: User) => {
            this.user = data;
          },
          error: () => {}
        });
      }

      if (screenfull.isEnabled) {
        this.screenFull = screenfull.isFullscreen;
        screenfull.on('change', () => {
          this.screenFull = screenfull.isFullscreen;
        });
      }
    }

    this.basket = this.basketService.getBasket();
    this.basketService.basketUpdated.subscribe((basket: CartItem[]) => {
      this.basket = basket;
    });
  }

  emptyBasket() {
    this.basketService.makeBasketEmpty();
  }

  goToCheckOut() {
    this.router.navigate(['/checkout']);
  }

  logOut() {
    this.authService.logout();
    this.user = undefined;
    this.router.navigate(['/login']);
  }

  toggleFullscreen() {
    if (isPlatformBrowser(this.platformId) && screenfull.isEnabled) {
      screenfull.toggle().then(() => {
        this.screenFull = screenfull.isFullscreen;
      });
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && screenfull.isEnabled) {
      screenfull.off('change', () => {
        this.screenFull = screenfull.isFullscreen;
      });
    }
  }
}
