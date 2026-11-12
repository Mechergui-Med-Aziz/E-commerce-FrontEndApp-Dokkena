import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4" style="max-width: 900px; margin: 0 auto; padding: 24px 16px;">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb" style="display: flex; gap: 8px; list-style: none; padding: 0; font-size: 14px; color: #64748b;">
          <li><a routerLink="/home" style="color: #4f46e5; text-decoration: none;">Accueil</a></li>
          <li>/</li>
          <li class="active" aria-current="page" style="color: #0f172a;">Mentions Légales</li>
        </ol>
      </nav>

      <h1 class="mb-4" style="font-size: 32px; font-weight: 700; color: #0f172a;">Mentions Légales</h1>

      <div style="line-height: 1.8; color: #334155; font-size: 15px;">
        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 24px;">1. Éditeur de la plateforme</h2>
        <p>
          Le site web <strong>Dokkena</strong> est édité par :<br>
          <strong>Raison sociale :</strong> Dokkena E-Commerce SARL <em>(TODO Propriétaire: Raison sociale officielle)</em><br>
          <strong>Matricule fiscal :</strong> 0000000/A/M/000 <em>(TODO Propriétaire: Matricule fiscal)</em><br>
          <strong>Registre de Commerce :</strong> B0000000000 <em>(TODO Propriétaire: N° Registre de Commerce)</em><br>
          <strong>Siège social :</strong> Tunis, Tunisie <em>(TODO Propriétaire: Adresse physique complète)</em><br>
          <strong>Directeur de publication :</strong> Mechergui Mohamed Aziz <em>(TODO Propriétaire: Nom du responsable légal)</em><br>
          <strong>Contact :</strong> contact&#64;dokkena.com
        </p>

        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 24px;">2. Hébergement</h2>
        <p>
          <strong>Frontend :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.<br>
          <strong>Backend & Base de données :</strong> Render Services Inc., 525 Brannan St Suite 300, San Francisco, CA 94107, États-Unis.
        </p>

        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 24px;">3. Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus (textes, graphismes, logos, icônes, images, code source) constituant la plateforme Dokkena est protégé par la législation relative à la propriété intellectuelle en vigueur en Tunisie et dans le monde. Toute reproduction non autorisée est strictement prohibée.
        </p>
      </div>
    </div>
  `
})
export class LegalComponent {}

