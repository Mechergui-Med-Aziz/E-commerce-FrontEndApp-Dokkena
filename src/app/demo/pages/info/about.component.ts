import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from 'src/app/services/seo-service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4" style="max-width: 900px; margin: 0 auto; padding: 24px 16px;">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb" style="display: flex; gap: 8px; list-style: none; padding: 0; font-size: 14px; color: #64748b;">
          <li><a routerLink="/" style="color: #4f46e5; text-decoration: none;">Accueil</a></li>
          <li>/</li>
          <li class="active" aria-current="page" style="color: #0f172a;">À propos</li>
        </ol>
      </nav>

      <h1 class="mb-4" style="font-size: 32px; font-weight: 700; color: #0f172a;">À propos de Dokkena</h1>

      <div class="content" style="line-height: 1.8; color: #334155; font-size: 16px;">
        <p class="lead" style="font-size: 18px; font-weight: 500; color: #1e293b;">
          Dokkena (inspiré du mot tunisien <em>dokkana</em>, la boutique de quartier) réinvente le commerce en ligne en Tunisie : la proximité, le conseil et la confiance d'un commerçant local, alliés au choix et à la modernité d'une grande plateforme.
        </p>

        <h2 style="font-size: 22px; font-weight: 600; margin-top: 32px; color: #0f172a;">Notre Mission</h2>
        <p>
          Offrir à chaque foyer tunisien une expérience d'achat simple, transparente et rapide : « Tout ce qu'il vous faut, au même endroit, livré vite et sans surprise ».
        </p>

        <h2 style="font-size: 22px; font-weight: 600; margin-top: 32px; color: #0f172a;">Nos 6 Univers</h2>
        <p>
          Nous sélectionnons avec soin des produits de qualité dans 6 catégories essentielles du quotidien :
        </p>
        <ul style="padding-left: 20px;">
          <li><strong>Électronique & High-Tech :</strong> smartphones, écouteurs, accessoires connectés.</li>
          <li><strong>Mode & Prêt-à-porter :</strong> vêtements tendance, maroquinerie, accessoires.</li>
          <li><strong>Maison & Cuisine :</strong> ustensiles, petits électroménagers pratiques et durables.</li>
          <li><strong>Sport & Fitness :</strong> équipements et tenues pour garder la forme.</li>
          <li><strong>Beauté & Soins :</strong> cosmétiques, parfumerie et soins personnels.</li>
          <li><strong>Jeux & Divertissement :</strong> gaming, consoles et jeux familiaux.</li>
        </ul>

        <h2 style="font-size: 22px; font-weight: 600; margin-top: 32px; color: #0f172a;">Nos Engagements</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 16px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
            <div style="font-size: 24px; margin-bottom: 8px;">🛡️</div>
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Paiement Sécurisé</h3>
            <p style="font-size: 14px; color: #64748b; margin: 0;">Paiement à la livraison ou en ligne selon vos préférences.</p>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
            <div style="font-size: 24px; margin-bottom: 8px;">🚚</div>
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Livraison Rapide</h3>
            <p style="font-size: 14px; color: #64748b; margin: 0;">Expédition sur toute la Tunisie en 24 à 72 heures ouvrées.</p>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
            <div style="font-size: 24px; margin-bottom: 8px;">💬</div>
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Service Client Proche</h3>
            <p style="font-size: 14px; color: #64748b; margin: 0;">Une équipe disponible via WhatsApp et téléphone du lundi au samedi.</p>
          </div>
        </div>

        <div style="margin-top: 32px; padding: 16px; background: #eef2ff; border-left: 4px solid #6366f1; border-radius: 4px; font-size: 14px; color: #3730a3;">
          <em>TODO (Propriétaire) : Préciser l'historique exact de fondation, l'adresse du siège social et les mentions spécifiques de l'équipe fondatrice.</em>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.update({
      title: 'À propos de Dokkena | Votre Boutique en Ligne de Confiance en Tunisie',
      description: 'Découvrez l\'histoire et la mission de Dokkena, votre commerce de proximité en ligne en Tunisie. Large choix, prix justes, livraison rapide et service client dévoué.',
      path: '/about'
    });
    this.seoService.setBreadcrumbJsonLd([
      { name: 'Accueil', url: '/' },
      { name: 'À propos', url: '/about' }
    ]);
  }
}

