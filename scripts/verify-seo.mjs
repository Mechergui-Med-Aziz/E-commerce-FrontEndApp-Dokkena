import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist/datta-able-free-angular-admin-template/browser');

function checkFile(relPath) {
  const fullPath = path.join(DIST_DIR, relPath);
  if (!fs.existsSync(fullPath)) {
    return { exists: false, error: 'File does not exist' };
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  return {
    exists: true,
    size: content.length,
    title: (content.match(/<title>([^<]+)<\/title>/) || [])[1],
    canonical: (content.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/) || content.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/) || [])[1],
    description: (content.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/) || content.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/) || [])[1],
    robots: (content.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/) || content.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']robots["']/) || [])[1],
    ogTitle: (content.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/) || [])[1],
    ogLocale: (content.match(/<meta[^>]+property=["']og:locale["'][^>]+content=["']([^"']+)["']/) || [])[1],
    hasH1: /<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(content),
    h1Text: (content.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.trim().replace(/<[^>]+>/g, ''),
    jsonLdScripts: (content.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || []).length
  };
}

console.log('====================================================');
console.log('🔍 DOKKENA SEO & PRERENDER AUDIT REPORT');
console.log('====================================================');

const pagesToAudit = [
  { name: 'Page d\'accueil (/)', path: 'index.html' },
  { name: 'Catégorie Beauté (/categories/beauty)', path: 'categories/beauty/index.html' },
  { name: 'Catégorie Électronique (/categories/electronic)', path: 'categories/electronic/index.html' },
  { name: 'Fiche Produit 1 (/product/1)', path: 'product/1/index.html' },
  { name: 'Page À propos (/about)', path: 'about/index.html' },
  { name: 'Page FAQ (/faq)', path: 'faq/index.html' },
  { name: 'Blog Liste (/blog)', path: 'blog/index.html' },
  { name: 'Article Blog 1 (/blog/guide-choisir...)', path: 'blog/guide-choisir-smartphone-tunisie/index.html' },
  { name: 'Article Blog 2 (/blog/tendances-mode...)', path: 'blog/tendances-mode-beaute-rentree/index.html' }
];

for (const p of pagesToAudit) {
  console.log(`\n📄 [Audit] ${p.name}`);
  const result = checkFile(p.path);
  if (!result.exists) {
    console.log(`   ❌ FICHIER MANQUANT : ${p.path}`);
  } else {
    console.log(`   ✅ Présent (${Math.round(result.size / 1024)} kB)`);
    console.log(`   - Title: ${result.title}`);
    console.log(`   - Canonical: ${result.canonical}`);
    console.log(`   - Meta Description: ${result.description ? result.description.slice(0, 80) + '...' : 'AUCUNE'}`);
    console.log(`   - Robots: ${result.robots || 'index, follow (défaut)'}`);
    console.log(`   - OG Title: ${result.ogTitle || 'N/A'}`);
    console.log(`   - OG Locale: ${result.ogLocale || 'N/A'}`);
    console.log(`   - H1 Présent: ${result.hasH1 ? 'OUI (' + result.h1Text + ')' : 'NON'}`);
    console.log(`   - Scripts JSON-LD: ${result.jsonLdScripts} bloc(s)`);
  }
}

console.log('\n----------------------------------------------------');
console.log('🤖 [Audit] robots.txt & sitemap.xml');
console.log('----------------------------------------------------');

const robotsPath = path.join(DIST_DIR, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf-8');
  console.log(`✅ robots.txt présent (${robots.length} octets)`);
  console.log(`   - Déclaration Sitemap: ${robots.includes('Sitemap:') ? 'OUI' : 'NON'}`);
  console.log(`   - Disallow /checkout: ${robots.includes('Disallow: /checkout') ? 'OUI' : 'NON'}`);
} else {
  console.log('❌ robots.txt MANQUANT');
}

const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  const urlCount = (sitemap.match(/<url>/g) || []).length;
  console.log(`✅ sitemap.xml présent (${Math.round(sitemap.length / 1024)} kB, ${urlCount} URLs déclarées)`);
} else {
  console.log('❌ sitemap.xml MANQUANT');
}

console.log('====================================================\n');
