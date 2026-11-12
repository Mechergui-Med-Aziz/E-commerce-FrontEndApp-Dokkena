import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (isVisible) {
      <div class="announcement-bar">
        <div class="announcement-content">
          <span class="announcement-badge">OFFRE SPÉCIALE</span>
          <span class="announcement-text">
            🚚 <strong>Livraison Gratuite</strong> partout en Tunisie dès <strong>{{ freeShippingThreshold }} TND</strong> d'achats !
          </span>
          <a routerLink="/product-list" class="announcement-cta">Profiter des offres →</a>
        </div>
        <button class="announcement-close" (click)="close()" aria-label="Fermer le bandeau">×</button>
      </div>
    }
  `,
  styles: [`
    .announcement-bar {
      background: linear-gradient(90deg, #4338ca 0%, #6366f1 100%);
      color: #ffffff;
      padding: 8px 16px;
      font-size: 13px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .announcement-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
      text-align: center;
    }

    .announcement-badge {
      background: #facc15;
      color: #0f172a;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 12px;
      letter-spacing: 0.5px;
    }

    .announcement-text {
      color: #ffffff;
    }

    .announcement-cta {
      color: #fef08a;
      font-weight: 600;
      text-decoration: underline;
      margin-left: 4px;
    }

    .announcement-cta:hover {
      color: #ffffff;
    }

    .announcement-close {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      opacity: 0.8;
      padding: 0 4px;
    }

    .announcement-close:hover {
      opacity: 1;
    }

    @media (max-width: 640px) {
      .announcement-badge {
        display: none;
      }
      .announcement-bar {
        padding: 6px 36px 6px 12px;
        font-size: 12px;
      }
    }
  `]
})
export class AnnouncementBarComponent implements OnInit {
  freeShippingThreshold = environment.freeShippingThreshold || 100;
  isVisible = true;

  ngOnInit(): void {
    // Check if previously dismissed in session
    try {
      if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('dismiss_announcement') === 'true') {
        this.isVisible = false;
      }
    } catch {
      // Ignored
    }
  }

  close(): void {
    this.isVisible = false;
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('dismiss_announcement', 'true');
      }
    } catch {
      // Ignored
    }
  }
}

