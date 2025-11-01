import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-search',
  imports: [SharedModule, CommonModule],
  templateUrl: './nav-search.component.html',
  styleUrls: ['./nav-search.component.scss']
})
export class NavSearchComponent implements OnDestroy {
  searchInterval;
  searchWidth: number;
  searchWidthString: string;
  allowed: boolean = true;
  allowedRoutes: string[] = ['/home','/categories/beauty','/categories/electronic','/categories/fashion','/categories/game','/categories/kitchen','/categories/sport','/product-list'];

  routerSub: Subscription;

  constructor(private router: Router) {
    this.searchWidth = 0;

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.allowed = this.allowedRoutes.includes(url);
        this.searchOff();
      }
    });
  }

  searchOn() {
    document.querySelector('#main-search').classList.add('open');
    this.searchInterval = setInterval(() => {
      if (this.searchWidth >= 170) clearInterval(this.searchInterval);
      this.searchWidth += 30;
      this.searchWidthString = this.searchWidth + 'px';
    }, 35);
    let currentUrl=this.router.url
    console.log(currentUrl)
  }

  searchOff() {
    this.searchInterval = setInterval(() => {
      if (this.searchWidth <= 0) {
        document.querySelector('#main-search')?.classList.remove('open');
        clearInterval(this.searchInterval);
      }
      this.searchWidth -= 30;
      this.searchWidthString = this.searchWidth + 'px';
    }, 35);
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }
}
