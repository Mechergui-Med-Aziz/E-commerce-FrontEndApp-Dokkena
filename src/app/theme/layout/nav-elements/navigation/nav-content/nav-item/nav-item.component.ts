// angular import
import { Component, inject, input, PLATFORM_ID } from '@angular/core';
import { Location, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { NavigationItem } from '../../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-item',
  imports: [SharedModule, RouterModule],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent {
  private location = inject(Location);
  private platformId = inject(PLATFORM_ID);

  item = input<NavigationItem>();

  closeOtherMenu(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    const ele = event.target as HTMLElement;
    if (ele) {
      const parent = ele.parentElement as HTMLElement;
      const up_parent = ((parent?.parentElement as HTMLElement)?.parentElement as HTMLElement)?.parentElement as HTMLElement;
      const last_parent = (up_parent?.parentElement as HTMLElement)?.parentElement as HTMLElement;
      if (last_parent?.classList.contains('pcoded-submenu')) {
        up_parent?.classList.remove('pcoded-trigger', 'active');
      } else {
        const sections = document.querySelectorAll('.pcoded-hasmenu');
        for (let i = 0; i < sections.length; i++) {
          sections[i].classList.remove('active', 'pcoded-trigger');
        }
      }

      if (parent?.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger', 'active');
      } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger', 'active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger', 'active');
      }
    }
    const nav = document.querySelector('app-navigation.pcoded-navbar');
    if (nav?.classList.contains('mob-open')) {
      nav.classList.remove('mob-open');
    }
  }
}
