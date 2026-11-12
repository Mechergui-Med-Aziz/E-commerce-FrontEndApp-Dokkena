import { RenderMode, ServerRoute, PrerenderFallback } from '@angular/ssr';
import { environment } from '../environments/environment';

async function ids(path: string, limit = 25): Promise<Record<string, string>[]> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${environment.apiUrl}/${path}`, {
        signal: AbortSignal.timeout(90000)
      });
      if (res.ok) {
        const items = await res.json();
        if (Array.isArray(items)) {
          const selected = limit > 0 ? items.slice(0, limit) : items;
          return selected.map((x: any) => ({ id: String(x.id) }));
        }
      }
    } catch {
      // Continue to next attempt
    }
  }
  return []; // Ne jamais faire échouer le build : fallback vers le client
}

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'home', renderMode: RenderMode.Client },
  { path: 'product-list', renderMode: RenderMode.Prerender },
  { path: 'product-details', renderMode: RenderMode.Prerender },
  {
    path: 'product/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => ids('product', 25),
    fallback: PrerenderFallback.Client
  },
  {
    path: 'produit/:id',
    renderMode: RenderMode.Client
  },
  { path: 'categories/beauty', renderMode: RenderMode.Prerender },
  { path: 'categories/electronic', renderMode: RenderMode.Prerender },
  { path: 'categories/fashion', renderMode: RenderMode.Prerender },
  { path: 'categories/game', renderMode: RenderMode.Prerender },
  { path: 'categories/kitchen', renderMode: RenderMode.Prerender },
  { path: 'categories/sport', renderMode: RenderMode.Prerender },
  {
    path: 'category/:slug',
    renderMode: RenderMode.Client
  },
  {
    path: 'categorie/:slug',
    renderMode: RenderMode.Client
  },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'faq', renderMode: RenderMode.Prerender },
  { path: 'delivery-returns', renderMode: RenderMode.Prerender },
  { path: 'terms', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  { path: 'legal', renderMode: RenderMode.Prerender },
  { path: 'blog', renderMode: RenderMode.Prerender },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve([
      { slug: 'guide-choisir-smartphone-tunisie' },
      { slug: 'tendances-mode-beaute-rentree' }
    ]),
    fallback: PrerenderFallback.Client
  },
  { path: 'cart', renderMode: RenderMode.Client },
  { path: 'checkout', renderMode: RenderMode.Client },
  { path: 'payment', renderMode: RenderMode.Client },
  { path: 'profile', renderMode: RenderMode.Client },
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'register', renderMode: RenderMode.Client },
  { path: 'auth/**', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client }
];
