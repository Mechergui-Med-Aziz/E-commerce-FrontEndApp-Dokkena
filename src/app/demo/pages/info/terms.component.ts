import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4" style="max-width: 900px; margin: 0 auto; padding: 24px 16px;">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb" style="display: flex; gap: 8px; list-style: none; padding: 0; font-size: 14px; color: #64748b;">
          <li><a routerLink="/home" style="color: #4f46e5; text-decoration: none;">Accueil</a></li>
          <li>/</li>
          <li class="active" aria-current="page" style="color: #0f172a;">Conditions Générales de Vente</li>
        </ol>
      </nav>

      <h1 class="mb-4" style="font-size: 32px; font-weight: 700; color: #0f172a;">Conditions Générales de Vente (CGV)</h1>

      <div style="line-height: 1.8; color: #334155; font-size: 15px;">
        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 24px;">Article 1 - Objet et champ d'application</h2>
        <p>
          Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des transactions effectuées sur le site e-commerce Dokkena (ci-après « le Site ») accessible à l'adresse dokkena.vercel.app. Toute commande passée sur le Site implique l'adhésion entière et sans réserve du client aux présentes CGV.
        </p>

        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 24px;">Article 2 - Prix et Disponibilité</h2>
        <p>
          Tous les prix des produits sont indiqués en Dinars Tunisiens (TND) toutes taxes comprises (TTC). Les frais de livraison sont mentionnés de manière transparente avant la validation finale de la commande. Les offres de produits et de prix sont valables tant qu'elles sont visibles sur le Site.
        </p>

        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 24px;">Article 3 - Commande et Validation</h2>
        <p>
          Le client sélectionne les articles désirés et procède à la validation de son panier. La confirmation de la commande intervient par email ou SMS récapitulatif. Dokkena se réserve le droit de refuser toute commande pour motif légitime (litige préalable, indisponibilité exceptionnelle).
        </p>

        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 24px;">Article 4 - Paiement</h2>
        <p>
          Les modes de paiement acceptés comprennent le paiement comptant en espèces à la livraison (Cash on Delivery) et le règlement en ligne par carte bancaire nationale sécurisée.
        </p>

        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 24px;">Article 5 - Droit de rétractation et garanties</h2>
        <p>
          Conformément à la législation tunisienne sur la protection du consommateur, le client dispose d'un délai légal pour retourner un produit non conforme ou exercer son droit de rétractation dans les conditions détaillées sur notre page dédiée à la livraison et aux retours.
        </p>

        <div style="margin-top: 32px; padding: 16px; background: #eef2ff; border-left: 4px solid #6366f1; border-radius: 4px; font-size: 14px; color: #3730a3;">
          <em>TODO (Propriétaire) : Faire valider les présentes CGV par un conseiller juridique pour conformité avec la loi tunisienne n° 2000-83 sur les échanges et le commerce électroniques.</em>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {}

