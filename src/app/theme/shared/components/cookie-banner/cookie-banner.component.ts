import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics-service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (showBanner) {
      <div class="dokkena-cookie-banner" role="dialog" aria-live="polite" aria-label="Gestion des cookies">
        <div class="cookie-container">
          <div class="cookie-text">
            <span class="cookie-icon">🍪</span>
            <p class="cookie-message mb-0">
              <strong>Respect de votre vie privée :</strong> Dokkena utilise des cookies indispensables et, avec votre accord, des cookies de mesure d'audience pour vous proposer les meilleures offres e-commerce en Tunisie. Vos informations restent strictement confidentielles et conformes à la loi tunisienne (INPDP).
              <a routerLink="/privacy" class="cookie-link">En savoir plus</a>.
            </p>
          </div>
          <div class="cookie-actions">
            <button class="btn-refuse" (click)="decline()">
              Refuser
            </button>
            <button class="btn-accept" (click)="accept()">
              Accepter & Continuer
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dokkena-cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 99999;
      background: #0f172a;
      color: #f8fafc;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.25);
      border-top: 2px solid #4f46e5;
      padding: 16px 24px;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }

    .cookie-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }

    .cookie-text {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex: 1;
      min-width: 280px;
    }

    .cookie-icon {
      font-size: 24px;
      line-height: 1;
    }

    .cookie-message {
      font-size: 13px;
      line-height: 1.5;
      color: #cbd5e1;
    }

    .cookie-message strong {
      color: #ffffff;
    }

    .cookie-link {
      color: #818cf8;
      text-decoration: underline;
      margin-left: 4px;
      font-weight: 500;
    }

    .cookie-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .btn-refuse {
      background: transparent;
      border: 1px solid #475569;
      color: #cbd5e1;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-refuse:hover {
      background: #1e293b;
      color: #ffffff;
    }

    .btn-accept {
      background: #4f46e5;
      border: none;
      color: #ffffff;
      padding: 8px 20px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
      transition: all 0.2s;
    }

    .btn-accept:hover {
      background: #4338ca;
    }

    @media (max-width: 768px) {
      .cookie-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class CookieBannerComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  showBanner = false;

  ngOnInit(): void {
    this.showBanner = !this.analyticsService.hasAnsweredConsent();
  }

  accept(): void {
    this.analyticsService.setConsent(true);
    this.showBanner = false;
  }

  decline(): void {
    this.analyticsService.setConsent(false);
    this.showBanner = false;
  }
}

