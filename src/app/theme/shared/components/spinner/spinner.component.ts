import { Component, OnDestroy, ViewEncapsulation, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Spinkit } from './spinkits';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss', './spinkit-css/sk-line-material.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  readonly loadingService = inject(LoadingService);

  isSpinnerVisible = false;
  Spinkit = Spinkit;
  readonly backgroundColor = input('#1dc4e9');
  readonly spinner = input(Spinkit.skLine);

  timer!: ReturnType<typeof setTimeout>;

  constructor() {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          this.isSpinnerVisible = true;
          if (isPlatformBrowser(this.platformId)) {
            document.body.style.overflow = 'hidden';
            document.body.style.pointerEvents = 'none';
          }
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.isSpinnerVisible = false;
            if (isPlatformBrowser(this.platformId)) {
              document.body.style.overflow = '';
              document.body.style.pointerEvents = '';
            }
          }, 300);
        }
      },
      () => {
        this.isSpinnerVisible = false;
        if (isPlatformBrowser(this.platformId)) {
          document.body.style.overflow = '';
          document.body.style.pointerEvents = '';
        }
      }
    );
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    }
  }
}
