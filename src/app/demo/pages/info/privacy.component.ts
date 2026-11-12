import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4" style="max-width: 900px; margin: 0 auto; padding: 24px 16px;">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb" style="display: flex; gap: 8px; list-style: none; padding: 0; font-size: 14px; color: #64748b;">
          <li><a routerLink="/home" style="color: #4f46e5; text-decoration: none;">Accueil</a></li>
          <li>/</li>
          <li class="active" aria-current="page" style="color: #0f172a;">Politique de Confidentialité</li>
        </ol>
      </nav>

      <h1 class="mb-4" style="font-size: 32px; font-weight: 700; color: #0f172a;">Politique de Confidentialité & Protection des Données</h1>

      <div style="line-height: 1.8; color: #334155; font-size: 15px;">
        <p>
          Dokkena attache une importance fondamentale à la protection de la vie privée et des données à caractère personnel de ses utilisateurs.
        </p>

        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 24px;">1. Données collectées</h2>
        <p>
          Les données collectées se limitent aux informations indispensables au traitement de vos commandes et à votre relation client : nom, prénom, numéro de téléphone, adresse de livraison et adresse email.
        </p>

        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 24px;">2. Utilisation des données</h2>
        <p>
          Vos informations ne sont jamais revendues à des tiers. Elles sont exclusivement utilisées pour :
        </p>
        <ul style="padding-left: 20px;">
          <li>La préparation et la livraison de vos colis par nos livreurs partenaires.</li>
          <li>L'envoi des confirmations de commande et du suivi logistique.</li>
          <li>L'amélioration technique du site et le respect de nos obligations légales.</li>
        </ul>

        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 24px;">3. Cookies et traceurs</h2>
        <p>
          Dokkena utilise des cookies strictement nécessaires au bon fonctionnement du site (maintien du panier d'achat, session utilisateur). Les cookies d'analyse statistique et de mesure d'audience (Google Analytics 4) ne sont activés qu'après votre consentement explicite via notre bandeau de gestion des cookies.
        </p>

        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 24px;">4. Vos droits</h2>
        <p>
          Conformément à la loi organique tunisienne n° 2004-63 portant sur la protection des données à caractère personnel, vous bénéficiez d'un droit permanent d'accès, de rectification et de suppression de vos données en contactant notre délégué par email à dpo&#64;dokkena.com.
        </p>

        <div style="margin-top: 32px; padding: 16px; background: #eef2ff; border-left: 4px solid #6366f1; border-radius: 4px; font-size: 14px; color: #3730a3;">
          <em>TODO (Propriétaire) : Déclarer le fichier client auprès de l'INPDP (Instance Nationale de Protection des Données Personnelles de Tunisie).</em>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {}

