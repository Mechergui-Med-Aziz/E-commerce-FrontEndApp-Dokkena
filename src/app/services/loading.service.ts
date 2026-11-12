import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;
  readonly isLoading = signal(false);
  readonly isSlowApi = signal(false);
  private slowTimer: any = null;

  startRequest() {
    this.activeRequests++;
    this.isLoading.set(true);

    if (this.activeRequests === 1) {
      // If a request takes more than 3.5 seconds, API is likely waking up from cold start
      this.slowTimer = setTimeout(() => {
        if (this.activeRequests > 0) {
          this.isSlowApi.set(true);
        }
      }, 3500);
    }
  }

  endRequest() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this.isLoading.set(false);
      this.isSlowApi.set(false);
      if (this.slowTimer) {
        clearTimeout(this.slowTimer);
        this.slowTimer = null;
      }
    }
  }
}

