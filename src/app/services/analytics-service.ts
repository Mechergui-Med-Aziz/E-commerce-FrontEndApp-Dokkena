import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private pid = inject(PLATFORM_ID);
  private router = inject(Router);

  init() {
    if (!isPlatformBrowser(this.pid)) return;          // obligatoire (prerender)
    (window as any).dataLayer ??= [];
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => setTimeout(() => this.push('spa_page_view', {
        page_path: e.urlAfterRedirects, page_title: document.title,
        page_location: location.href }), 0));          // setTimeout : le titre SEO est déjà à jour
  }
  push(event: string, data: object = {}) {
    if (!isPlatformBrowser(this.pid)) return;
    (window as any).dataLayer.push({ ecommerce: null }); // vide l'objet précédent
    (window as any).dataLayer.push({ event, ...data });
  }
}
