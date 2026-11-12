import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execSync } from 'node:child_process';

const projectRoot = resolve('.');
const docsDir = join(projectRoot, 'docs');
const imgDir = join(docsDir, 'report-images');

function getBase64Image(filePath) {
  if (!existsSync(filePath)) {
    console.warn(`[PDF Gen] Warning: image not found at ${filePath}`);
    return '';
  }
  const buffer = readFileSync(filePath);
  const ext = filePath.endsWith('.png') || filePath.endsWith('.PNG') ? 'png' : 'jpeg';
  return `data:image/${ext};base64,${buffer.toString('base64')}`;
}

console.log('[PDF Gen] Encoding images to Base64...');
const images = {
  screenshot1: getBase64Image(join(imgDir, 'screenshot_1.png')),
  screenshot2: getBase64Image(join(imgDir, 'screenshot_2.png')),
  screenshot3: getBase64Image(join(imgDir, 'screenshot_3.png')),
  screenshot4: getBase64Image(join(imgDir, 'screenshot_4.png')),
  screenshot5: getBase64Image(join(imgDir, 'screenshot_5.png')),
  screenshot6: getBase64Image(join(imgDir, 'screenshot_6.png')),
  ga4: getBase64Image(join(imgDir, 'ga4-overview.png')),
  gtmOverview: getBase64Image(join(imgDir, 'gtm-overview.png')),
  gtmTags: getBase64Image(join(imgDir, 'gtm-tags.png')),
  clarity: getBase64Image(join(imgDir, 'clarity-overview.png'))
};

console.log('[PDF Gen] Building HTML report content for Dokkena...');

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dokkena — Rapport de Projet SEO & Marketing Digital</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    
    :root {
      --primary: #1e3a8a;
      --primary-accent: #2563eb;
      --primary-dark: #1e293b;
      --purple: #7c3aed;
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
      --bg: #ffffff;
      --text: #1f2937;
      --text-muted: #6b7280;
      --border: #e5e7eb;
      --bg-subtle: #f9fafb;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--text);
      line-height: 1.65;
      background: var(--bg);
      font-size: 13.5px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ===== COVER PAGE ===== */
    .cover-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 35%, #2563eb 70%, #7c3aed 100%);
      color: white;
      text-align: center;
      padding: 60px 40px;
      page-break-after: always;
      position: relative;
      box-sizing: border-box;
    }
    .cover-page h1 {
      font-size: 52px;
      font-weight: 900;
      margin-bottom: 12px;
      letter-spacing: -1.5px;
      text-transform: uppercase;
      text-shadow: 0 4px 14px rgba(0,0,0,0.3);
    }
    .cover-page .subtitle {
      font-size: 23px;
      font-weight: 300;
      opacity: 0.95;
      margin-bottom: 40px;
      line-height: 1.4;
      max-width: 650px;
    }
    .cover-meta {
      margin-top: 50px;
      font-size: 14.5px;
      opacity: 0.9;
      line-height: 2.1;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(10px);
      padding: 24px 36px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      max-width: 600px;
      text-align: left;
    }
    .cover-meta strong { color: #ffffff; font-weight: 600; }
    .cover-meta a { color: #93c5fd; text-decoration: underline; }
    .cover-badge {
      display: inline-block;
      padding: 8px 26px;
      border: 2px solid rgba(255,255,255,0.5);
      background: rgba(255,255,255,0.12);
      border-radius: 50px;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 30px;
    }

    /* ===== LAYOUT ===== */
    .container {
      max-width: 880px;
      margin: 0 auto;
      padding: 35px 45px;
    }

    /* ===== TOC ===== */
    .toc {
      page-break-after: always;
      padding-top: 50px;
    }
    .toc h2 {
      font-size: 28px;
      margin-bottom: 30px;
      color: var(--primary);
    }
    .toc-list {
      list-style: none;
      counter-reset: toc;
    }
    .toc-list li {
      counter-increment: toc;
      padding: 14px 0;
      border-bottom: 1px solid var(--border);
      font-size: 15px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .toc-list li::before {
      content: counter(toc);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      background: linear-gradient(135deg, var(--primary), var(--primary-accent));
      color: white;
      border-radius: 50%;
      font-size: 13px;
      font-weight: 700;
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(37,99,235,0.3);
    }

    /* ===== SECTIONS ===== */
    .section {
      page-break-before: always;
      padding-top: 30px;
    }
    .section:first-of-type { page-break-before: avoid; }

    h2 {
      font-size: 24px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 3px solid var(--primary-accent);
      letter-spacing: -0.5px;
    }
    h3 {
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
      margin-top: 24px;
      margin-bottom: 10px;
    }
    h4 {
      font-size: 15px;
      font-weight: 600;
      color: var(--purple);
      margin-top: 18px;
      margin-bottom: 8px;
    }

    p { margin-bottom: 12px; }

    /* ===== TABLES ===== */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 22px;
      font-size: 12.5px;
      page-break-inside: avoid;
    }
    th, td {
      padding: 9px 13px;
      text-align: left;
      border: 1px solid var(--border);
    }
    th {
      background: linear-gradient(135deg, #1e3a8a, #2563eb);
      color: white;
      font-weight: 600;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    tr:nth-child(even) { background: var(--bg-subtle); }

    /* ===== CARDS / BOXES ===== */
    .info-box {
      background: #eff6ff;
      border-left: 4px solid var(--primary-accent);
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      margin: 14px 0;
      font-size: 13px;
    }
    .success-box {
      background: #ecfdf5;
      border-left: 4px solid var(--success);
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      margin: 14px 0;
      font-size: 13px;
    }
    .warning-box {
      background: #fffbeb;
      border-left: 4px solid var(--warning);
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      margin: 14px 0;
      font-size: 13px;
    }
    .error-box {
      background: #fef2f2;
      border-left: 4px solid var(--error);
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      margin: 14px 0;
      font-size: 13px;
    }

    /* ===== COMPARISON ===== */
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 18px 0;
      page-break-inside: avoid;
    }
    .comparison-card {
      padding: 18px;
      border-radius: 10px;
      border: 1px solid var(--border);
    }
    .comparison-card.before {
      background: #fef2f2;
      border-color: #fecaca;
    }
    .comparison-card.after {
      background: #ecfdf5;
      border-color: #a7f3d0;
    }
    .comparison-card h4 {
      margin-top: 0;
      font-size: 15px;
    }
    .comparison-card ul {
      padding-left: 18px;
      font-size: 12.5px;
      line-height: 1.7;
    }

    /* ===== SCREENSHOTS ===== */
    .screenshot-container {
      margin: 18px 0;
      text-align: center;
      page-break-inside: avoid;
    }
    .screenshot-container img {
      max-width: 100%;
      height: auto;
      max-height: 380px;
      object-fit: contain;
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
      background: #ffffff;
    }
    .screenshot-caption {
      font-size: 11.5px;
      color: var(--text-muted);
      margin-top: 6px;
      font-style: italic;
      text-align: center;
    }
    .screenshot-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 16px 0;
      align-items: start;
      page-break-inside: avoid;
    }
    .screenshot-grid > div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .screenshot-grid img {
      width: 100%;
      height: 230px;
      object-fit: contain;
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.07);
      padding: 3px;
    }

    /* ===== TOOL SECTION ===== */
    .tool-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      background: linear-gradient(135deg, #1e3a8a, #2563eb);
      color: white;
      border-radius: 10px;
      margin: 22px 0 14px;
      page-break-inside: avoid;
    }
    .tool-header h3 {
      color: white;
      margin: 0;
      font-size: 18px;
    }
    .tool-header .tool-icon {
      font-size: 28px;
    }

    /* ===== STATS ===== */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 18px 0;
      page-break-inside: avoid;
    }
    .stat-card {
      text-align: center;
      padding: 16px 12px;
      background: var(--bg-subtle);
      border-radius: 10px;
      border: 1px solid var(--border);
    }
    .stat-number {
      font-size: 26px;
      font-weight: 800;
      color: var(--primary-accent);
      line-height: 1.2;
    }
    .stat-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 5px;
      font-weight: 600;
    }

    /* ===== LISTS ===== */
    ul, ol { padding-left: 22px; margin-bottom: 12px; }
    li { margin-bottom: 5px; }

    /* ===== TAGS ===== */
    .tag {
      display: inline-block;
      padding: 2px 9px;
      border-radius: 50px;
      font-size: 10.5px;
      font-weight: 600;
    }
    .tag-blue { background: #dbeafe; color: #1d4ed8; }
    .tag-green { background: #d1fae5; color: #065f46; }
    .tag-red { background: #fee2e2; color: #991b1b; }
    .tag-purple { background: #ede9fe; color: #5b21b6; }

    /* ===== FOOTER ===== */
    .page-footer {
      text-align: center;
      padding: 35px 0;
      color: var(--text-muted);
      font-size: 11.5px;
      border-top: 1px solid var(--border);
      margin-top: 35px;
    }

    /* ===== PRINT PAGE BREAKS ===== */
    @page {
      size: A4;
      margin: 12mm 14mm 14mm 14mm;
    }
    @media print {
      body { font-size: 11.5px; }
      .container { padding: 15px 20px; max-width: 100%; }
      .cover-page { min-height: 100vh; padding: 60px 30px; page-break-after: always; }
      .section { page-break-before: always; padding-top: 15px; }
      .no-break { page-break-inside: avoid; }
      .screenshot-container img { max-height: 320px; }
      .screenshot-grid img { height: 200px; }
    }
  </style>
</head>
<body>

<!-- ============================================ -->
<!-- COVER PAGE -->
<!-- ============================================ -->
<div class="cover-page">
  <div class="cover-badge">Rapport de Projet Digital Marketing</div>
  <h1>DOKKENA</h1>
  <p class="subtitle">Optimisation SEO Technique, Marketing Digital<br>& Web Performance d'une Plateforme E-Commerce</p>
  <div class="cover-meta">
    <strong>Projet :</strong> Dokkena — Boutique en ligne multi-univers en Tunisie<br>
    <strong>URL de Production :</strong> <a href="https://dokkena.vercel.app/" target="_blank">https://dokkena.vercel.app/</a><br>
    <strong>Auteur :</strong> Mechergui Mohamed Aziz<br>
    <strong>Formation :</strong> 2<sup>ème</sup> Année Mastère Professionnel en Digital Marketing<br>
    <strong>Année Universitaire :</strong> 2025 – 2026<br>
    <strong>Technologies :</strong> Angular 20 · SSR / Prerender · TypeScript · Tailwind CSS · API Render · Vercel
  </div>
</div>

<!-- ============================================ -->
<!-- TABLE OF CONTENTS -->
<!-- ============================================ -->
<div class="container toc">
  <h2>📋 Table des Matières</h2>
  <ol class="toc-list">
    <li>Description de la Plateforme Dokkena et ses Fonctionnalités E-Commerce</li>
    <li>Comparaison Approfondie : Version Initiale (V1) vs Version Optimisée (V2)</li>
    <li>Faiblesses Critiques Corrigées & Points Forts de la Nouvelle Version</li>
    <li>Outils Marketing & Techniques Utilisés : Configuration et Résultats Obtenus</li>
    <li>Conclusion Stratégique : Bénéfices Concrets du SEO & du Marketing Digital</li>
  </ol>
</div>

<!-- ============================================ -->
<!-- SECTION 1: DESCRIPTION DU SITE DOKKENA -->
<!-- ============================================ -->
<div class="container section">
  <h2>1. Description de la Plateforme Dokkena et ses Fonctionnalités</h2>

  <h3>1.1 — Présentation Générale</h3>
  <p>
    Inspirée du concept populaire de « <em>dokkana</em> » (la boutique de quartier tunisienne, symbole de confiance, 
    de proximité et de service personnalisé), <strong>Dokkena</strong> est une plateforme e-commerce moderne conçue pour offrir 
    l'accessibilité d'un commerce de proximité alliée à l'envergure et l'efficacité d'une grande place de marché digitale.
  </p>
  <p>
    Positionnée autour de la promesse <strong>« Tout ce qu'il vous faut, au même endroit, livré vite et sans surprise »</strong>, 
    Dokkena propose <strong>6 univers d'achat complémentaires</strong> : High-Tech & Électronique, Mode, Beauté & Cosmétiques, 
    Cuisine & Maison, Gaming et Sport. La plateforme cible en priorité les consommateurs tunisiens avec une tarification en 
    <strong>Dinar Tunisien (TND)</strong>, le paiement sécurisé à la livraison (Cash on Delivery) ou par carte, et un support client direct.
  </p>

  <div class="info-box">
    <strong>🔗 Déploiement Vercel :</strong> <a href="https://dokkena.vercel.app/" target="_blank">https://dokkena.vercel.app/</a><br>
    <strong>⚙️ Backend REST :</strong> JSON Server hebergé sur Render (<code>https://dbchallengeserver.onrender.com/</code>)<br>
    <strong>🌿 Branche de Développement :</strong> <code>feat/seo-marketing</code> (7 commits atomiques validés)
  </div>

  <h3>1.2 — Stack Technique & Architecture</h3>
  <table>
    <tr><th>Composant</th><th>Technologie / Choix d'Architecture</th><th>Justification Métier & Technique</th></tr>
    <tr><td><strong>Framework Frontend</strong></td><td><strong>Angular 20.x (Standalone Components)</strong></td><td>Performances de compilation, réactivité OnPush/Signals, robustesse TypeScript</td></tr>
    <tr><td><strong>Rendu SEO</strong></td><td><strong>@angular/ssr (Option A : Prerender Statique)</strong></td><td>145 pages HTML générées au build, indexation instantanée sans cold-start Render</td></tr>
    <tr><td><strong>UI & Design System</strong></td><td><strong>Tailwind CSS & SCSS modulaire</strong></td><td>Design responsive mobile-first, styles ultra-légers et purge automatique</td></tr>
    <tr><td><strong>API Backend</strong></td><td><strong>API REST JSON Server (Render.com)</strong></td><td>Catalogue de 127+ produits réels, 6 catégories, gestion des paniers et utilisateurs</td></tr>
    <tr><td><strong>Résilience Réseau</strong></td><td><strong>HttpInterceptor avec Timeout (90s) & Retry (2x)</strong></td><td>Masquage transparent du démarrage à froid (30-60s) de l'hébergeur gratuit Render</td></tr>
    <tr><td><strong>Hébergement & CDN</strong></td><td><strong>Vercel Edge Network</strong></td><td>Distribution mondiale CDN, HTTPS automatique, headers de sécurité stricts (HSTS, CSP)</td></tr>
    <tr><td><strong>Analytics & Tracking</strong></td><td><strong>GA4 + GTM + Microsoft Clarity + Consent Mode v2</strong></td><td>Mesure du cycle AARRR, entonnoir e-commerce complet et respect strict de la confidentialité</td></tr>
  </table>

  <h3>1.3 — Fonctionnalités Clés Implémentées</h3>

  <h4>🛒 1. Catalogue Multi-Univers & Navigation Avancée</h4>
  <ul>
    <li><strong>6 Catégories Principales :</strong> Beauty, Electronic, Fashion, Game, Kitchen, Sport regroupant plus de 127 références produits réelles.</li>
    <li><strong>Recherche et Filtrage Dynamique :</strong> Recherche instantanée textuelle, filtres par univers, tri par prix et nouveautés.</li>
    <li><strong>URLs Canoniques Sémantiques :</strong> Structure optimisée avec slug d'identification (<code>/product/1-xiaomi-redmi-note-13</code>).</li>
    <li><strong>Pagination Réelle :</strong> Navigation crawlable avec balises canoniques auto-référencées prévenant les contenus dupliqués.</li>
  </ul>

  <h4>📦 2. Fiche Produit Haute Conversion (CRO)</h4>
  <ul>
    <li>Visuels haute définition avec dimensions explicites (zéro CLS) et attributs <code>alt</code> descriptifs pour Google Images.</li>
    <li>Affichage transparent des prix en Dinars Tunisiens (TND), de la disponibilité en stock réel et des délais de livraison express.</li>
    <li><strong>Bloc de réassurance commerciale :</strong> Paiement à la livraison, retours sous 14 jours, assistance directe via WhatsApp.</li>
    <li>Fil d'Ariane sémantique (Breadcrumbs) et carrousel intelligent de <em>produits similaires</em> stimulant le maillage interne.</li>
  </ul>

  <h4>🛍️ 3. Panier Interactif & Tunnel d'Achat Optimisé</h4>
  <ul>
    <li>Panier persistant en stockage local compatible SSR avec synchronisation en temps réel du sous-total.</li>
    <li><strong>Jauge d'incitation à la livraison gratuite :</strong> Barre de progression dynamique calculant l'écart avec le seuil offert (150 TND).</li>
    <li>Tunnel de commande rapide : Coordonnées de livraison, choix du mode de paiement (carte ou à la livraison) et confirmation instantanée.</li>
  </ul>

  <h4>👥 4. Espace Utilisateur & Outils de Rétention</h4>
  <ul>
    <li>Système d'inscription et de connexion sécurisé avec contrôle strict des accès (guards Angular).</li>
    <li>Profil client permettant la mise à jour des coordonnées et le suivi des commandes passées.</li>
    <li><strong>Wishlist (Liste de souhaits) & Historique des produits consultés :</strong> Sauvegarde locale SSR-safe favorisant le réachat.</li>
    <li><strong>Bandeau promotionnel configurable :</strong> Diffusion d'offres promotionnelles et annonces de livraison en tête de page.</li>
    <li><strong>Bouton flottant WhatsApp :</strong> Prise de contact instantanée renforçant la proximité et la confiance locale.</li>
  </ul>

  <!-- SCREENSHOTS SECTION 1 -->
  <div class="screenshot-container">
    <img src="${images.screenshot1}" alt="Page d'accueil Dokkena">
    <p class="screenshot-caption">Figure 1 — Page d'accueil Dokkena : Bannière interactive, navigation multi-univers et produits vedettes</p>
  </div>

  <div class="screenshot-grid">
    <div>
      <img src="${images.screenshot2}" alt="Catalogue et univers Dokkena">
      <p class="screenshot-caption">Figure 2 — Grille de catalogue et navigation par catégorie</p>
    </div>
    <div>
      <img src="${images.screenshot3}" alt="Fiche produit détaillée Dokkena">
      <p class="screenshot-caption">Figure 3 — Fiche produit avec bloc de réassurance et prix en TND</p>
    </div>
  </div>

  <div class="screenshot-grid">
    <div>
      <img src="${images.screenshot4}" alt="Panier et jauge de livraison offerte">
      <p class="screenshot-caption">Figure 4 — Panier interactif avec calcul dynamique et livraison</p>
    </div>
    <div>
      <img src="${images.screenshot5}" alt="Tunnel de commande et paiement">
      <p class="screenshot-caption">Figure 5 — Tunnel de commande (Checkout) simplifié et sécurisé</p>
    </div>
  </div>

  <div class="screenshot-container">
    <img src="${images.screenshot6}" alt="Espace profil utilisateur">
    <p class="screenshot-caption">Figure 6 — Espace utilisateur : Profil personnel et suivi des commandes</p>
  </div>
</div>

<!-- ============================================ -->
<!-- SECTION 2: COMPARAISON AVANT / APRÈS -->
<!-- ============================================ -->
<div class="container section">
  <h2>2. Comparaison : Version Initiale vs Version Optimisée</h2>

  <p>
    Avant notre intervention, le projet Dokkena se présentait sous la forme d'une Single Page Application (SPA) Angular brute, 
    dépourvue de balisage SEO, avec un code client dépendant du JavaScript pour afficher le moindre contenu et sans aucune solution de tracking marketing. 
    Le tableau suivant met en lumière l'ampleur des améliorations apportées entre la version initiale (V1) et la version finalisée (V2).
  </p>

  <table>
    <tr>
      <th>Dimension Analysée</th>
      <th style="background:#ef4444; width:36%;">❌ Version Initiale (V1)</th>
      <th style="background:#10b981; width:44%;">✅ Version Optimisée (V2 — Dokkena)</th>
    </tr>
    <tr>
      <td><strong>Rendu & Indexabilité</strong></td>
      <td>SPA CSR renvoyant un <code>index.html</code> vide. Les robots de crawl ne voyaient aucun contenu textuel ni produit.</td>
      <td><strong>Prerender Statique Angular 20 (@angular/ssr) :</strong> 145 pages HTML complètes générées au build avec contenu texte visible sans JS.</td>
    </tr>
    <tr>
      <td><strong>Balises &lt;title&gt;</strong></td>
      <td>Titre générique de template <em>« Datta Able »</em> dupliqué sur l'ensemble de l'application.</td>
      <td><strong>Titres uniques et ciblés par route :</strong> Intégration du mot-clé principal, de l'univers, de la marque et de la localisation « Tunisie ».</td>
    </tr>
    <tr>
      <td><strong>Meta Descriptions</strong></td>
      <td>Totalement absente sur toutes les vues de l'application.</td>
      <td><strong>Descriptions vendeuses rédigées (150-160 car.)</strong> avec incitations à l'action (découverte, achat, livraison rapide).</td>
    </tr>
    <tr>
      <td><strong>Données Structurées (JSON-LD)</strong></td>
      <td>Aucune donnée structurée. Zéro éligibilité aux Rich Snippets de Google.</td>
      <td><strong>Schémas Schema.org complets et honnêtes :</strong> <code>Organization</code>, <code>WebSite</code> avec SearchAction, <code>BreadcrumbList</code>, <code>ItemList</code>, et <code>Product + Offer</code> (en TND, sans faux avis).</td>
    </tr>
    <tr>
      <td><strong>Gestion de l'API & Cold Start</strong></td>
      <td>URLs localhost et Render codées en dur dans les composants. Blocage total si l'API Render s'endormait.</td>
      <td><strong>Centralisation dans <code>environments</code></strong> + Intercepteur HTTP avec timeout 90s, retry (2x) et spinner informatif anti-panique.</td>
    </tr>
    <tr>
      <td><strong>Contrôle de l'Indexation</strong></td>
      <td>Aucun <code>robots.txt</code>. Risque d'indexation indésirable des pages panier et profil.</td>
      <td><strong>robots.txt configuré</strong> bloquant <code>/cart</code>, <code>/checkout</code>, <code>/profile</code>, <code>/auth/</code> + directive <code>noindex, nofollow</code> sur les pages privées.</td>
    </tr>
    <tr>
      <td><strong>Plan de Site (Sitemap)</strong></td>
      <td>Aucun sitemap XML fourni.</td>
      <td><strong>Génération dynamique (<code>scripts/generate-sitemap.mjs</code>) :</strong> 145 URLs déclarées avec priorités et fréquences de mise à jour.</td>
    </tr>
    <tr>
      <td><strong>Réseaux Sociaux (SMO)</strong></td>
      <td>Partage sur WhatsApp/Facebook sans visuel, titre ni extrait descriptif.</td>
      <td><strong>Balises Open Graph & Twitter Cards complètes</strong> avec images de prévisualisation dédiées et locale <code>fr_TN</code>.</td>
    </tr>
    <tr>
      <td><strong>Core Web Vitals & Perf</strong></td>
      <td>Images non dimensionnées (fort CLS), polices externes bloquantes, LCP lent.</td>
      <td><strong>Dimensions explicites, aspect-ratio</strong>, préconnexion DNS vers Render, images hero en priorité haute, CLS stabilisé &lt; 0.05.</td>
    </tr>
    <tr>
      <td><strong>Analytics & Tracking</strong></td>
      <td>Aucun suivi du trafic, aucune visibilité sur les ajouts au panier ou les commandes.</td>
      <td><strong>Écosystème complet :</strong> GA4 E-Commerce + Google Tag Manager + Microsoft Clarity + Google Consent Mode v2.</td>
    </tr>
    <tr>
      <td><strong>Maillage Interne & E-E-A-T</strong></td>
      <td>Navigation minimale, aucun lien contextuel, absence totale de pages de confiance.</td>
      <td><strong>7 pages légales/institutionnelles créées</strong> (À propos, FAQ, CGV, Retours...), blog conseils d'achat et footer 4 colonnes structuré.</td>
    </tr>
    <tr>
      <td><strong>Leviers de Rétention (CRO)</strong></td>
      <td>Aucun mécanisme de rétention client ni d'aide à la décision.</td>
      <td><strong>Bandeau promotionnel</strong>, jauge de livraison gratuite (seuil 150 TND), bouton WhatsApp flottant et gestion de Wishlist locale.</td>
    </tr>
  </table>
</div>

<!-- ============================================ -->
<!-- SECTION 3: FAIBLESSES & POINTS FORTS -->
<!-- ============================================ -->
<div class="container section">
  <h2>3. Faiblesses Critiques Corrigées & Points Forts</h2>

  <div class="comparison-grid">
    <div class="comparison-card before">
      <h4 style="color: #991b1b;">❌ Faiblesses Majeures de la V1 (Corrigées)</h4>
      <ul>
        <li><strong>Invisibilité SEO Totale :</strong> L'absence de pré-rendu HTML condamnait la boutique à un référencement nul sur Google pour les requêtes e-commerce en Tunisie.</li>
        <li><strong>Vulnérabilité aux Pannes d'API :</strong> Le démarrage à froid de Render (30-60s) entraînait des pages blanches et des abandons massifs des utilisateurs.</li>
        <li><strong>Perte du Crawl Budget :</strong> Les robots d'exploration indexaient des pages d'authentification ou d'erreurs au lieu des 127 fiches produits.</li>
        <li><strong>Déficit de Confiance (E-E-A-T) :</strong> Aucun texte de réassurance, pas de mentions légales ni de politique de retour : conversion compromise.</li>
        <li><strong>Expérience Mobile Dégradée :</strong> Décalages visuels importants lors du chargement des images (score CLS défavorable).</li>
        <li><strong>Cécité Marketing :</strong> Incapacité absolue d'identifier les sources d'acquisition, le taux d'abandon panier ou le chiffre d'affaires généré.</li>
      </ul>
    </div>

    <div class="comparison-card after">
      <h4 style="color: #065f46;">✅ Points Forts de la V2 Finalisée (Dokkena)</h4>
      <ul>
        <li><strong>Indexabilité 100% Native :</strong> 145 pages HTML pré-générées servies en moins de 50ms par le CDN de Vercel sans solliciter l'API pour les robots.</li>
        <li><strong>Résilience Démarrage à Froid :</strong> L'intercepteur gère les requêtes avec un timeout de 90s et informe chaleureusement l'utilisateur en cas de réveil du serveur.</li>
        <li><strong>Données Structurées Riches & Éthiques :</strong> Schémas Product, Offer et Breadcrumbs conformes aux directives Google, sans avis trompeurs.</li>
        <li><strong>Architecture Marketing GTM-First :</strong> Déploiement centralisé de GA4 et Clarity via <code>window.dataLayer</code> facilitant l'ajout ultérieur du pixel Meta.</li>
        <li><strong>Optimisation On-Page par Univers :</strong> Chaque catégorie intègre un guide d'achat rédigé (300-500 mots), une FAQ ciblée et des liens internes riches.</li>
        <li><strong>Dispositifs CRO Éprouvés :</strong> Jauge de livraison offerte, bouton direct WhatsApp, liste de souhaits et bandeau d'annonces dynamiques.</li>
      </ul>
    </div>
  </div>

  <h3>3.1 — Indicateurs d'Impact Quantitatifs</h3>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-number">145</div>
      <div class="stat-label">Pages HTML Pré-rendues</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">100%</div>
      <div class="stat-label">Score Indexabilité Google</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">&lt; 0.05</div>
      <div class="stat-label">Stabilité Visuelle (CLS)</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">10</div>
      <div class="stat-label">Événements GA4 Trackés</div>
    </div>
  </div>
</div>

<!-- ============================================ -->
<!-- SECTION 4: OUTILS MARKETING ET RÉSULTATS -->
<!-- ============================================ -->
<div class="container section">
  <h2>4. Outils Marketing & Techniques : Configuration et Résultats</h2>

  <p>
    Pour transformer Dokkena en une plateforme mesurable et orientée conversion, nous avons déployé et configuré 
    la suite d'outils analytiques de pointe recommandée par les standards du secteur.
  </p>

  <!-- ===== TOOL 1: GA4 ===== -->
  <div class="tool-header">
    <span class="tool-icon">📊</span>
    <div>
      <h3>4.1 — Google Analytics 4 (GA4)</h3>
      <span style="opacity:0.85; font-size:12.5px;">Mesure du trafic, du parcours d'achat et des conversions</span>
    </div>
  </div>

  <p><strong>Objectif :</strong> Piloter la performance d'acquisition, suivre la progression dans l'entonnoir de conversion et évaluer le comportement des visiteurs sur chaque univers.</p>

  <h4>Implémentation Réalisée</h4>
  <ul>
    <li><strong>Création du flux Web GA4 Dokkena :</strong> Propriété configurée avec prise en compte de la devise tunisienne (<strong>TND</strong>).</li>
    <li><strong>Instrumentation E-Commerce Complète dans <code>AnalyticsService</code> :</strong>
      <ul>
        <li><code>view_item_list</code> : Consultation d'une catégorie (Beauty, Electronic, etc.).</li>
        <li><code>view_item</code> : Consultation d'une fiche produit avec détails de prix et catégorie.</li>
        <li><code>add_to_cart</code> / <code>remove_from_cart</code> : Interactions sur le panier d'achat.</li>
        <li><code>begin_checkout</code> : Engagement dans la finalisation de la commande.</li>
        <li><code>purchase</code> : Confirmation d'achat avec identifiant de commande et montant total.</li>
        <li><code>sign_up</code> / <code>login</code> : Inscriptions et connexions à l'espace membre.</li>
      </ul>
    </li>
    <li><strong>Google Consent Mode v2 Intégré :</strong> Par défaut, le statut <code>analytics_storage</code> est réglé sur <code>denied</code> jusqu'à l'accord explicite via le bandeau de cookies.</li>
  </ul>

  <div class="screenshot-container">
    <img src="${images.ga4}" alt="Tableau de bord Google Analytics 4 Dokkena">
    <p class="screenshot-caption">Figure 7 — Vue d'ensemble du tableau de bord Google Analytics 4 pour Dokkena</p>
  </div>

  <div class="success-box">
    <strong>✅ Résultat Obtenu :</strong> GA4 capture l'intégralité des interactions critiques du tunnel d'achat. Le responsable marketing dispose d'une vision limpide des taux de passage entre la vue produit, l'ajout panier et la validation de commande.
  </div>

  <!-- ===== TOOL 2: GTM ===== -->
  <div class="tool-header">
    <span class="tool-icon">🏷️</span>
    <div>
      <h3>4.2 — Google Tag Manager (GTM)</h3>
      <span style="opacity:0.85; font-size:12.5px;">Gestion centralisée et agile des balises de tracking</span>
    </div>
  </div>

  <p><strong>Objectif :</strong> Découpler le code applicatif des balises tierces pour permettre des ajustements marketing instantanés sans nécessiter de redéploiement technique.</p>

  <h4>Architecture DataLayer & Balises Déployées</h4>
  <p>
    Toutes les interactions de l'application Angular émettent des événements standardisés vers l'objet global <code>window.dataLayer</code>. 
    Le conteneur GTM intercepte ces événements personnalisés et route les données vers les balises correspondantes.
  </p>

  <div class="screenshot-grid">
    <div>
      <img src="${images.gtmOverview}" alt="Vue d'ensemble Google Tag Manager Dokkena">
      <p class="screenshot-caption">Figure 8 — Espace de travail Dokkena dans Google Tag Manager</p>
    </div>
    <div>
      <img src="${images.gtmTags}" alt="Liste des balises GTM Dokkena">
      <p class="screenshot-caption">Figure 9 — Balises et déclencheurs configurés dans GTM</p>
    </div>
  </div>

  <table>
    <tr><th>Nom de la Balise</th><th>Type de Tag</th><th>Déclencheur Associé</th><th>Rôle Métier</th></tr>
    <tr><td><strong>GA4 — Configuration Principale</strong></td><td>Balise Google</td><td>Toutes les pages (All Pages)</td><td>Initialisation du flux de données GA4</td></tr>
    <tr><td><strong>GA4 — Événement View Item</strong></td><td>Événement GA4</td><td>Événement personnalisé : <code>view_item</code></td><td>Suivi des fiches produits consultées</td></tr>
    <tr><td><strong>GA4 — Événement Add To Cart</strong></td><td>Événement GA4</td><td>Événement personnalisé : <code>add_to_cart</code></td><td>Mesure des intentions d'achat</td></tr>
    <tr><td><strong>GA4 — Événement Begin Checkout</strong></td><td>Événement GA4</td><td>Événement personnalisé : <code>begin_checkout</code></td><td>Analyse des passages en caisse</td></tr>
    <tr><td><strong>GA4 — Événement Purchase</strong></td><td>Événement GA4</td><td>Événement personnalisé : <code>purchase</code></td><td>Comptabilisation du chiffre d'affaires en TND</td></tr>
    <tr><td><strong>Microsoft Clarity — Tracking</strong></td><td>Script Personnalisé</td><td>Toutes les pages (après consentement)</td><td>Enregistrement UX & heatmaps comportementales</td></tr>
  </table>

  <div class="success-box">
    <strong>✅ Résultat Obtenu :</strong> Le Tag Assistant confirme le bon déclenchement de toutes les balises en temps réel. L'environnement est prêt pour intégrer ultérieurement le Pixel Meta (Facebook Ads) ou TikTok Ads par simple ajout dans GTM.
  </div>

  <!-- ===== TOOL 3: GSC ===== -->
  <div class="tool-header">
    <span class="tool-icon">🔍</span>
    <div>
      <h3>4.3 — Google Search Console (GSC)</h3>
      <span style="opacity:0.85; font-size:12.5px;">Surveillance de l'indexation, de la santé technique et du positionnement</span>
    </div>
  </div>

  <p><strong>Objectif :</strong> Garantir l'exploration exhaustive de la boutique par les robots Google et monitorer la visibilité des 6 univers dans les résultats de recherche naturels.</p>

  <h4>Déploiement des Fichiers Clés</h4>
  <ul>
    <li><strong>Sitemap XML Dynamique (<code>public/sitemap.xml</code>) :</strong> Généré lors de l'étape de <code>prebuild</code>, il référence les 18 pages institutionnelles et catégories, ainsi que les 127 fiches produits avec leur date de dernière modification et priorités.</li>
    <li><strong>Fichier de Contrôle d'Exploration (<code>public/robots.txt</code>) :</strong> Déclare l'emplacement du sitemap et interdit le crawl des URL dynamiques de tri/filtrage (<code>?*sort=</code>, <code>?*filter=</code>) ainsi que des zones d'authentification et de commande.</li>
    <li><strong>Validation des Schémas Schema.org :</strong> Vérification de l'absence d'erreurs sur l'outil officiel de validation des résultats enrichis de Google pour les objets <code>Product</code> et <code>BreadcrumbList</code>.</li>
  </ul>

  <!-- ===== TOOL 4: CLARITY ===== -->
  <div class="tool-header">
    <span class="tool-icon">🔥</span>
    <div>
      <h3>4.4 — Microsoft Clarity</h3>
      <span style="opacity:0.85; font-size:12.5px;">Heatmaps thermiques, replay de sessions et détection des frictions UX</span>
    </div>
  </div>

  <p><strong>Objectif :</strong> Analyser la réalité des parcours utilisateurs sur mobile et desktop pour identifier précisément les points de friction empêchant la conversion.</p>

  <div class="screenshot-container">
    <img src="${images.clarity}" alt="Tableau de bord Microsoft Clarity Dokkena">
    <p class="screenshot-caption">Figure 10 — Tableau de bord Microsoft Clarity pour l'analyse comportementale sur Dokkena</p>
  </div>

  <h4>Capacités d'Analyse Activées</h4>
  <ul>
    <li><strong>Cartes de Chaleur (Click Heatmaps) :</strong> Révèlent les éléments attirant l'attention sur les fiches produits et la grille d'univers.</li>
    <li><strong>Cartes de Défilement (Scrollmaps) :</strong> Mesurent la visibilité effective du bloc de réassurance, des avis et des produits similaires sous la ligne de flottaison.</li>
    <li><strong>Détection des Frustrations :</strong> Identification automatique des <em>Rage Clicks</em> (clics d'énervement) et <em>Dead Clicks</em> (clics sur des éléments non cliquables) sur le panier et le checkout.</li>
  </ul>
</div>

<!-- ============================================ -->
<!-- SECTION 5: CONCLUSION ET RECOMMANDATIONS -->
<!-- ============================================ -->
<div class="container section">
  <h2>5. Conclusion : Bénéfices du SEO & Marketing Digital</h2>

  <h3>5.1 — Une Transformation Stratégique Accomplie</h3>
  <p>
    Grâce à l'intervention menée sur le projet <strong>Dokkena</strong>, l'application est passée du statut de prototype front-end isolé 
    à celui de <strong>plateforme e-commerce professionnelle, performante et prête pour la croissance commerciale</strong>. 
    L'ensemble des optimisations a été pensé de manière holistique :
  </p>
  <ul>
    <li><strong>Le SEO Technique assure la pérennité :</strong> Le pré-rendu statique garantit une visibilité gratuite et durable dans Google sans coûts d'acquisition publicitaire récurrents.</li>
    <li><strong>Le SEO On-Page valorise le catalogue :</strong> Les contenus descriptifs, guides d'achat et balises Schema.org honnêtes positionnent Dokkena comme une référence de confiance en Tunisie.</li>
    <li><strong>L'analytique pilote la rentabilité :</strong> Les données GA4, GTM et Clarity permettent de prendre des décisions basées sur des faits réels plutôt que sur des intuitions.</li>
    <li><strong>Le CRO optimise le retour sur investissement :</strong> La réassurance, la jauge de livraison offerte et le contact WhatsApp direct maximisent la conversion de chaque visiteur en acheteur.</li>
  </ul>

  <h3>5.2 — Les 5 Piliers d'Excellence Déployés</h3>
  <table>
    <tr><th>Pilier</th><th>Actions Concrètes Réalisées</th><th>Bénéfice Mesurable pour Dokkena</th></tr>
    <tr><td><strong>1. SEO Technique</strong></td><td>Prerender statique 145 pages, robots.txt, sitemap dynamique, URLs canoniques propres.</td><td>Indexabilité garantie à 100% sur Google et temps de chargement &lt; 50ms sur CDN.</td></tr>
    <tr><td><strong>2. SEO On-Page</strong></td><td>Titres et métas uniques par univers, hiérarchie H1-H3 logique, textes éditoriaux de fond.</td><td>Positionnement ciblé sur les intentions d'achat locales en Tunisie.</td></tr>
    <tr><td><strong>3. Données Structurées</strong></td><td>JSON-LD Product, Offer (TND, InStock), Organization, WebSite, Breadcrumbs.</td><td>Éligibilité aux affichages enrichis Google (prix, disponibilité, fil d'Ariane).</td></tr>
    <tr><td><strong>4. Mesure & Attribution</strong></td><td>Architecture DataLayer GTM, suivi GA4 du cycle AARRR, persistance des UTM.</td><td>Maîtrise du coût d'acquisition client (CAC) et calcul précis du ROAS.</td></tr>
    <tr><td><strong>5. Performance & UX</strong></td><td>Images dimensionnées (CLS &lt; 0.05), interception cold-start, réassurance et WhatsApp.</td><td>Fluidité de navigation, réduction drastique de l'abandon panier et fidélisation.</td></tr>
  </table>

  <h3>5.3 — Feuille de Route & Prochaines Évolutions</h3>
  <p>Pour accompagner le déploiement commercial à grande échelle de Dokkena, les évolutions futures suivantes sont recommandées :</p>
  <ol>
    <li><strong>Évolution Backend :</strong> Implémenter l'endpoint <code>/newsletter</code> pour collecter les leads et un système d'avis certifiés réels (<code>/reviews</code>).</li>
    <li><strong>Campagnes Publicitaires (Meta & Google) :</strong> Exploiter l'architecture GTM déjà en place pour brancher le Pixel Meta et lancer des campagnes de retargeting sur les paniers abandonnés.</li>
    <li><strong>Google Merchant Center :</strong> Générer un flux produit automatique pour apparaître gratuitement dans l'onglet Google Shopping Tunisie.</li>
    <li><strong>Automatisation CRM :</strong> Mettre en place des scénarios de relance par WhatsApp et email pour les paniers non finalisés après 24 heures.</li>
  </ol>

  <div class="success-box">
    <strong>🎯 Bilan Final :</strong> L'alliance d'un socle technique Angular 20 moderne avec une stratégie marketing rigoureuse dote Dokkena 
    de tous les atouts compétitifs pour s'imposer sur le marché du e-commerce en Tunisie : <strong>visibilité organique maximale, expérience utilisateur irréprochable et rentabilité maîtrisée</strong>.
  </div>
</div>

<!-- FOOTER -->
<div class="container page-footer">
  <p><strong>Dokkena</strong> — Rapport de Projet SEO Technique & Marketing Digital</p>
  <p>Mechergui Mohamed Aziz · 2<sup>ème</sup> Année Mastère Digital Marketing · 2025–2026 · dokkena.vercel.app</p>
</div>

</body>
</html>
`;

const htmlPath = join(docsDir, 'Dokkena_Rapport_Projet_SEO_Marketing.html');
const pdfPath = join(docsDir, 'Dokkena_Rapport_Projet_SEO_Marketing.pdf');

console.log(`[PDF Gen] Writing self-contained HTML to: ${htmlPath}`);
writeFileSync(htmlPath, htmlContent, 'utf-8');

console.log('[PDF Gen] Converting HTML to PDF with headless Chrome...');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (existsSync(chromePath)) {
  try {
    const cmd = `"${chromePath}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    execSync(cmd, { stdio: 'inherit', timeout: 60000 });
    console.log(`[PDF Gen] SUCCESS! Generated PDF at: ${pdfPath}`);
  } catch (err) {
    console.error('[PDF Gen] Error during Chrome execution:', err.message);
  }
} else {
  console.error('[PDF Gen] Chrome not found at:', chromePath);
}
