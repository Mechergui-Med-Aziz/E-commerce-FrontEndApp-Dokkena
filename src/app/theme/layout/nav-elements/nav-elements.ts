import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { Footer } from './footer/footer';
import { AnnouncementBarComponent } from '../../shared/components/announcement-bar/announcement-bar.component';
import { CookieBannerComponent } from '../../shared/components/cookie-banner/cookie-banner.component';
import { WhatsappButtonComponent } from '../../shared/components/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-nav-elements',
  imports: [
    NavBarComponent,
    NavigationComponent,
    RouterModule,
    CommonModule,
    BreadcrumbsComponent,
    Footer,
    AnnouncementBarComponent,
    CookieBannerComponent,
    WhatsappButtonComponent
  ],
  templateUrl: './nav-elements.html',
  styleUrl: './nav-elements.scss'
})
export class NavElements {
  private platformId = inject(PLATFORM_ID);
  navCollapsed = false;
  navCollapsedMob = false;
  windowWidth = 1024;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.windowWidth = window.innerWidth;
    }
  }

  navMobClick() {
    if (!isPlatformBrowser(this.platformId)) return;
    const nav = document.querySelector('app-navigation.pcoded-navbar');
    if (this.navCollapsedMob && nav && !nav.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    if (!isPlatformBrowser(this.platformId)) return;
    const nav = document.querySelector('app-navigation.pcoded-navbar');
    if (nav?.classList.contains('mob-open')) {
      nav.classList.remove('mob-open');
    }
  }
}
