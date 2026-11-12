import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://dokkena.vercel.app';
const API_URL = 'https://dbchallengeserver.onrender.com/product';
const OUTPUT_DIR = path.resolve(__dirname, '../public');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'sitemap.xml');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

const staticRoutes = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/product-list', priority: '0.9', changefreq: 'daily' },
  { url: '/categories/beauty', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/electronic', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/fashion', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/game', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/kitchen', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/sport', priority: '0.8', changefreq: 'weekly' },
  { url: '/blog', priority: '0.7', changefreq: 'weekly' },
  { url: '/blog/top-5-gadgets-high-tech-tunisie-2026', priority: '0.6', changefreq: 'monthly' },
  { url: '/blog/routine-beaute-naturelle-guide-complet', priority: '0.6', changefreq: 'monthly' },
  { url: '/about', priority: '0.5', changefreq: 'monthly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' },
  { url: '/faq', priority: '0.5', changefreq: 'monthly' },
  { url: '/delivery-returns', priority: '0.5', changefreq: 'monthly' },
  { url: '/terms', priority: '0.3', changefreq: 'yearly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/legal', priority: '0.3', changefreq: 'yearly' }
];

async function generateSitemap() {
  console.log('[Sitemap] Generating sitemap.xml for Dokkena...');
  const today = new Date().toISOString().split('T')[0];
  const urls = [...staticRoutes.map((r) => ({ loc: `${BASE_URL}${r.url}`, priority: r.priority, changefreq: r.changefreq, lastmod: today }))];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const products = await res.json();
      if (Array.isArray(products)) {
        console.log(`[Sitemap] Fetched ${products.length} products from Render API.`);
        for (const p of products) {
          if (p && p.id) {
            const slug = p.name ? `${p.id}-${slugify(p.name)}` : `${p.id}`;
            urls.push({
              loc: `${BASE_URL}/product/${slug}`,
              priority: '0.7',
              changefreq: 'daily',
              lastmod: today
            });
          }
        }
      }
    } else {
      console.warn(`[Sitemap] API returned ${res.status}. Falling back to static pages.`);
    }
  } catch (err) {
    console.warn('[Sitemap] API request timed out or failed. Generating sitemap with static pages only.', err.message);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  fs.writeFileSync(OUTPUT_FILE, xml, 'utf-8');
  console.log(`[Sitemap] Successfully wrote ${urls.length} URLs to ${OUTPUT_FILE}`);
}

generateSitemap();

