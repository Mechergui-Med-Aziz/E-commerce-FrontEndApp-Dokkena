import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from 'src/app/services/seo-service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container text-center py-5 px-3">
      <div class="max-w-md mx-auto" style="max-width: 480px; margin: 40px auto; text-align: center;">
        <h1 class="display-1 text-primary font-bold mb-2" style="font-size: 72px; font-weight: 800; color: #4f46e5;">404</h1>
        <h2 class="h3 font-semibold mb-3" style="font-size: 24px; font-weight: 600; color: #1e293b;">Page introuvable</h2>
        <p class="text-muted mb-4" style="color: #64748b; margin-bottom: 24px; line-height: 1.6;">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée. Dokkena vous propose de continuer votre shopping.
        </p>
        <div class="d-flex justify-content-center gap-2" style="display: flex; justify-content: center; gap: 12px;">
          <a routerLink="/" class="btn btn-primary" style="background-color: #4f46e5; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500;">
            🏠 Retour à l'accueil
          </a>
          <a routerLink="/product-list" class="btn btn-outline-secondary" style="border: 1px solid #cbd5e1; color: #334155; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500;">
            🛍️ Découvrir le catalogue
          </a>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    this.seoService.update({
      title: 'Page introuvable (404) | Dokkena',
      description: 'La page demandée est introuvable.',
      path: '/404',
      noindex: true
    });
  }
}

