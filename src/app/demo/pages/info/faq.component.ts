import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4" style="max-width: 900px; margin: 0 auto; padding: 24px 16px;">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb" style="display: flex; gap: 8px; list-style: none; padding: 0; font-size: 14px; color: #64748b;">
          <li><a routerLink="/home" style="color: #4f46e5; text-decoration: none;">Accueil</a></li>
          <li>/</li>
          <li class="active" aria-current="page" style="color: #0f172a;">Foire Aux Questions</li>
        </ol>
      </nav>

      <h1 class="mb-4" style="font-size: 32px; font-weight: 700; color: #0f172a;">Foire Aux Questions (FAQ)</h1>

      <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 8px;">Quels sont les délais et tarifs de livraison en Tunisie ?</h2>
          <p style="color: #475569; line-height: 1.6; margin: 0;">
            Dokkena livre sur tout le territoire tunisien sous 24 à 72 heures ouvrées. Les frais de livraison s'élèvent à 7 TND, et sont entièrement offerts pour toute commande atteignant ou dépassant 100 TND.
          </p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 8px;">Comment puis-je régler ma commande ?</h2>
          <p style="color: #475569; line-height: 1.6; margin: 0;">
            Vous pouvez payer directement à la livraison en espèces auprès de notre livreur partenaire, ou régler en ligne par carte bancaire sécurisée.
          </p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 8px;">Comment retourner un produit non conforme ?</h2>
          <p style="color: #475569; line-height: 1.6; margin: 0;">
            Vous disposez d'un délai légal de 15 jours après réception pour demander l'échange ou le remboursement d'un article intact dans son emballage d'origine. Contactez notre support pour initier la procédure.
          </p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 8px;">Les produits sont-ils authentiques et garantis ?</h2>
          <p style="color: #475569; line-height: 1.6; margin: 0;">
            Absolument. Tous les produits vendus sur Dokkena proviennent de distributeurs officiels ou de partenaires certifiés. Les appareils électroniques bénéficient de la garantie constructeur.
          </p>
        </div>
      </div>
    </div>
  `
})
export class FaqComponent {}

