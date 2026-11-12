import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-delivery-returns',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4" style="max-width: 900px; margin: 0 auto; padding: 24px 16px;">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb" style="display: flex; gap: 8px; list-style: none; padding: 0; font-size: 14px; color: #64748b;">
          <li><a routerLink="/home" style="color: #4f46e5; text-decoration: none;">Accueil</a></li>
          <li>/</li>
          <li class="active" aria-current="page" style="color: #0f172a;">Livraison et Retours</li>
        </ol>
      </nav>

      <h1 class="mb-4" style="font-size: 32px; font-weight: 700; color: #0f172a;">Livraison et Retours</h1>

      <div style="line-height: 1.8; color: #334155; font-size: 16px;">
        <h2 style="font-size: 22px; font-weight: 600; color: #0f172a; margin-top: 24px;">1. Modalités de Livraison en Tunisie</h2>
        <p>
          Dokkena assure la livraison express de vos commandes sur l'ensemble des 24 gouvernorats de la Tunisie via nos partenaires logistiques certifiés.
        </p>
        <ul style="padding-left: 20px;">
          <li><strong>Délai moyen de livraison :</strong> 24 à 48 heures pour le Grand Tunis et les grandes villes ; 48 à 72 heures pour le reste du pays.</li>
          <li><strong>Frais d'expédition :</strong> Tarif forfaitaire de <strong>7 TND</strong> par commande.</li>
          <li><strong>Livraison Gratuite :</strong> Offerte pour tout panier à partir de <strong>100 TND</strong>.</li>
        </ul>

        <h2 style="font-size: 22px; font-weight: 600; color: #0f172a; margin-top: 32px;">2. Suivi de votre colis</h2>
        <p>
          Dès expédition de votre colis, vous recevez un SMS ou un message WhatsApp avec le numéro d'expédition et le contact du livreur. Vous pouvez vérifier l'état de votre colis lors de sa réception.
        </p>

        <h2 style="font-size: 22px; font-weight: 600; color: #0f172a; margin-top: 32px;">3. Politique de Retours & Échanges</h2>
        <p>
          Votre satisfaction est notre priorité. Si un article ne vous convient pas ou présente une anomalie :
        </p>
        <ul style="padding-left: 20px;">
          <li>Vous disposez d'un délai de <strong>15 jours</strong> à compter de la date de livraison pour effectuer une demande de retour.</li>
          <li>L'article doit être neuf, non utilisé et renvoyé dans son emballage d'origine complet avec ses accessoires.</li>
          <li>En cas de produit défectueux ou d'erreur de livraison, les frais de retour sont intégralement pris en charge par Dokkena.</li>
        </ul>

        <div style="margin-top: 32px; padding: 16px; background: #eef2ff; border-left: 4px solid #6366f1; border-radius: 4px; font-size: 14px; color: #3730a3;">
          <em>TODO (Propriétaire) : Préciser le nom exact du transporteur partenaire et l'adresse physique du centre de traitement des retours.</em>
        </div>
      </div>
    </div>
  `
})
export class DeliveryReturnsComponent {}

