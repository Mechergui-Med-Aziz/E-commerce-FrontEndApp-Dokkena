import { Component, OnDestroy, ViewEncapsulation, inject, input } from '@angular/core';
import { Spinkit } from './spinkits';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss', './spinkit-css/sk-line-material.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {
  private router = inject(Router);

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

          
          document.body.style.overflow = 'hidden';
          document.body.style.pointerEvents = 'none';
        } 
        else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.isSpinnerVisible = false;

            document.body.style.overflow = '';
            document.body.style.pointerEvents = '';
          }, 1000);
        }
      },
      () => {
        this.isSpinnerVisible = false;
        document.body.style.overflow = '';
        document.body.style.pointerEvents = '';
      }
    );
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    document.body.style.overflow = '';
    document.body.style.pointerEvents = '';
  }
}
