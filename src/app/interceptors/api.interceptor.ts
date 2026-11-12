import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { timeout, retry, catchError, finalize, timer, throwError } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const isApiRequest = req.url.includes('dbchallengeserver.onrender.com') || req.url.startsWith('/api');

  if (isApiRequest) {
    loadingService.startRequest();
  }

  return next(req).pipe(
    timeout(90000), // 90 seconds timeout for Render cold start
    retry({
      count: 2,
      delay: (error, retryCount) => {
        // Only retry on network failure or 5xx server errors
        if (error instanceof HttpErrorResponse && error.status >= 400 && error.status < 500) {
          throw error;
        }
        return timer(retryCount * 1500);
      }
    }),
    catchError((error: HttpErrorResponse | any) => {
      console.warn(`[Dokkena API] Requête échouée (${req.url}):`, error?.message || error);
      return throwError(() => error);
    }),
    finalize(() => {
      if (isApiRequest) {
        loadingService.endRequest();
      }
    })
  );
};
