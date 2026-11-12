// angular import
import { Component, output, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavRightComponent } from './nav-right/nav-right.component';

@Component({
  selector: 'app-nav-bar',
  imports: [SharedModule, NavRightComponent, RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  private platformId = inject(PLATFORM_ID);
  readonly NavCollapsedMob = output();
  navCollapsedMob = false;
  headerStyle = '';
  menuClass = false;
  collapseStyle = 'none';

  toggleMobOption() {
    this.menuClass = !this.menuClass;
    this.headerStyle = this.menuClass ? 'none' : '';
    this.collapseStyle = this.menuClass ? 'block' : 'none';
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    if (isPlatformBrowser(this.platformId)) {
      const nav = document.querySelector('app-navigation.pcoded-navbar');
      if (nav?.classList.contains('mob-open')) {
        nav.classList.remove('mob-open');
      }
    }
  }
}
