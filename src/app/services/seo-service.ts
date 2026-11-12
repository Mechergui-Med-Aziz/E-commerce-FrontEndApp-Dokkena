import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

export interface SeoConfig {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  private readonly defaultSiteName = environment.siteName || 'Dokkena';
  private readonly baseUrl = environment.siteUrl.replace(/\/$/, '');
  private readonly defaultImage = `${this.baseUrl}/assets/images/logo-dark.png`;

  update(config: SeoConfig): void {
    const formattedTitle = config.title.includes(this.defaultSiteName)
      ? config.title
      : `${config.title} | ${this.defaultSiteName}`;

    this.titleService.setTitle(formattedTitle);

    const description = config.description ||
      'Dokkena, votre boutique en ligne de référence en Tunisie. Découvrez nos collections Électronique, Mode, Beauté, Cuisine, Sport et Gaming aux meilleurs prix.';
    this.metaService.updateTag({ name: 'description', content: description });

    const fullUrl = config.path
      ? `${this.baseUrl}${config.path.startsWith('/') ? config.path : '/' + config.path}`
      : this.baseUrl;

    // Canonical link
    this.setCanonicalUrl(fullUrl);

    // Robots meta tag
    if (config.noindex) {
      this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' });
      this.metaService.updateTag({ name: 'googlebot', content: 'noindex, nofollow' });
    } else {
      this.metaService.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });
      this.metaService.updateTag({ name: 'googlebot', content: 'index, follow' });
    }

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: formattedTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: fullUrl });
    this.metaService.updateTag({ property: 'og:site_name', content: this.defaultSiteName });
    this.metaService.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.metaService.updateTag({ property: 'og:locale', content: 'fr_TN' });
    this.metaService.updateTag({ property: 'og:image', content: config.image || this.defaultImage });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: formattedTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: config.image || this.defaultImage });
  }

  setCanonicalUrl(url: string): void {
    try {
      let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    } catch {
      // Ignored if DOM operations fail
    }
  }

  setJsonLd(id: string, data: object): void {
    try {
      let script = this.document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = this.document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        this.document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data, null, 2);
    } catch {
      // Ignored if DOM operations fail
    }
  }

  removeJsonLd(id: string): void {
    try {
      const script = this.document.getElementById(id);
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    } catch {
      // Ignored
    }
  }

  setOrganizationAndWebsiteJsonLd(): void {
    const orgData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${this.baseUrl}/#organization`,
          name: this.defaultSiteName,
          url: this.baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${this.baseUrl}/assets/images/logo-dark.png`
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Support',
            availableLanguage: ['fr', 'ar'],
            areaServed: 'TN'
          }
        },
        {
          '@type': 'WebSite',
          '@id': `${this.baseUrl}/#website`,
          url: this.baseUrl,
          name: this.defaultSiteName,
          description: 'Boutique en ligne en Tunisie : High-Tech, Mode, Beauté, Cuisine, Sport et Gaming',
          publisher: {
            '@id': `${this.baseUrl}/#organization`
          },
          inLanguage: 'fr-TN',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${this.baseUrl}/product-list?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        }
      ]
    };
    this.setJsonLd('schema-org-website', orgData);
  }

  setBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): void {
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${this.baseUrl}${item.url.startsWith('/') ? item.url : '/' + item.url}`
      }))
    };
    this.setJsonLd('schema-breadcrumb', breadcrumbData);
  }

  setCategoryJsonLd(categoryName: string, categoryPath: string, products: any[]): void {
    const itemList = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${categoryName} - Dokkena`,
      description: `Découvrez notre sélection de produits dans la catégorie ${categoryName}.`,
      url: `${this.baseUrl}${categoryPath}`,
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((prod, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${this.baseUrl}/product-details/${prod.id}`,
        name: prod.name || prod.title,
        image: prod.imageUrl || prod.image
      }))
    };
    this.setJsonLd('schema-category-itemlist', itemList);
  }

  setProductJsonLd(product: any, productUrl: string): void {
    if (!product) return;
    const price = Number(product.price) || 0;
    const name = product.name || product.title || 'Produit Dokkena';
    const description = product.description || `${name} au meilleur prix sur Dokkena Tunisie.`;
    const image = product.imageUrl || product.image || this.defaultImage;

    const productSchema: any = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${productUrl}#product`,
      name: name,
      description: description,
      image: [image],
      offers: {
        '@type': 'Offer',
        url: productUrl,
        priceCurrency: 'TND',
        price: price.toFixed(2),
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: this.defaultSiteName
        }
      }
    };

    if (product.category) {
      productSchema.category = product.category;
    }

    // Constraint 6: Only add aggregateRating if REAL reviews exist in API
    if (product.rating && typeof product.rating === 'object' && product.rating.rate && product.rating.count > 0) {
      productSchema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.rating.rate,
        reviewCount: product.rating.count
      };
    }

    this.setJsonLd('schema-product', productSchema);
  }
}

