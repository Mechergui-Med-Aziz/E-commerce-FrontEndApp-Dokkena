import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (whatsappNumber) {
      <a 
        [href]="whatsappUrl" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="floating-whatsapp"
        aria-label="Contacter le support client Dokkena sur WhatsApp">
        <span class="whatsapp-tooltip">Besoin d'aide ? Écrivez-nous</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="#ffffff">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.109-.516-1.745-.724-2.884-2.511-2.973-2.628-.088-.117-.714-.949-.714-1.809 0-.86.448-1.282.608-1.455.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-12.416c-5.514 0-10 4.486-10 10 0 1.761.459 3.418 1.26 4.865l-1.336 4.887 5.011-1.314c1.405.767 3.011 1.206 4.717 1.206 5.514 0 10-4.486 10-10s-4.486-10-10-10z"/>
        </svg>
      </a>
    }
  `,
  styles: [`
    .floating-whatsapp {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #25d366;
      box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: transform 0.2s, box-shadow 0.2s;
      text-decoration: none;
    }

    .floating-whatsapp:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 18px rgba(37, 211, 102, 0.55);
    }

    .whatsapp-tooltip {
      position: absolute;
      right: 68px;
      background: #0f172a;
      color: #ffffff;
      font-size: 12px;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translateX(10px);
      transition: opacity 0.2s, transform 0.2s;
    }

    .floating-whatsapp:hover .whatsapp-tooltip {
      opacity: 1;
      transform: translateX(0);
    }
  `]
})
export class WhatsappButtonComponent implements OnInit {
  whatsappNumber = (environment.whatsappNumber || '').replace(/[^\d+]/g, '');
  whatsappUrl = '';

  ngOnInit(): void {
    if (this.whatsappNumber) {
      const cleanNum = this.whatsappNumber.replace('+', '');
      const text = encodeURIComponent("Bonjour Dokkena, j'aimerais avoir plus d'informations sur vos produits.");
      this.whatsappUrl = `https://wa.me/${cleanNum}?text=${text}`;
    }
  }
}

