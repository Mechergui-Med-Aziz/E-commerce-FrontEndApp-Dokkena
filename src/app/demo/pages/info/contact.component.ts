import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from 'src/app/services/seo-service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4" style="max-width: 900px; margin: 0 auto; padding: 24px 16px;">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb" style="display: flex; gap: 8px; list-style: none; padding: 0; font-size: 14px; color: #64748b;">
          <li><a routerLink="/" style="color: #4f46e5; text-decoration: none;">Accueil</a></li>
          <li>/</li>
          <li class="active" aria-current="page" style="color: #0f172a;">Contact</li>
        </ol>
      </nav>

      <h1 class="mb-4" style="font-size: 32px; font-weight: 700; color: #0f172a;">Contactez Dokkena</h1>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 24px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #0f172a;">Nos Coordonnées</h2>
          <p style="margin-bottom: 12px; line-height: 1.6; color: #334155;">
            <strong>📍 Adresse :</strong> Tunis, Tunisie <em>(TODO Propriétaire: Adresse complète)</em><br>
            <strong>📞 Téléphone :</strong> +216 71 000 000 <em>(TODO Propriétaire: Numéro officiel)</em><br>
            <strong>💬 WhatsApp Support :</strong> +216 00 000 000 <em>(TODO Propriétaire: Numéro WhatsApp direct)</em><br>
            <strong>📧 Email :</strong> contact&#64;dokkena.com<br>
            <strong>⏰ Horaires :</strong> Du Lundi au Samedi, 9h00 - 18h00
          </p>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #0f172a;">Envoyez-nous un message</h2>
          <form (submit)="$event.preventDefault()">
            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; color: #475569;">Votre nom</label>
              <input type="text" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" placeholder="Ex: Mohamed Ben Salah" />
            </div>
            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; color: #475569;">Votre email</label>
              <input type="email" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" placeholder="Ex: mohamed@example.com" />
            </div>
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; color: #475569;">Votre message</label>
              <textarea rows="4" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" placeholder="Comment pouvons-nous vous aider ?"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="background: #4f46e5; color: #fff; padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer;">
              Envoyer ma demande
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.update({
      title: 'Contactez le Service Client Dokkena | Support Téléphone, Email & WhatsApp',
      description: 'Besoin d\'aide pour votre commande ou une question produit ? Contactez l\'équipe Dokkena Tunisie par téléphone, WhatsApp ou formulaire. Réponse rapide garantie.',
      path: '/contact'
    });
    this.seoService.setBreadcrumbJsonLd([
      { name: 'Accueil', url: '/' },
      { name: 'Contact', url: '/contact' }
    ]);
  }
}

