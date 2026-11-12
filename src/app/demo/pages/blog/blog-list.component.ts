import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BLOG_POSTS, BlogPost } from 'src/app/services/blog-data';
import { SeoService } from 'src/app/services/seo-service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4" style="max-width: 1000px; margin: 0 auto; padding: 24px 16px;">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb" style="display: flex; gap: 8px; list-style: none; padding: 0; font-size: 14px; color: #64748b;">
          <li><a routerLink="/" style="color: #4f46e5; text-decoration: none;">Accueil</a></li>
          <li>/</li>
          <li class="active" aria-current="page" style="color: #0f172a;">Blog & Guides d'achat</li>
        </ol>
      </nav>

      <div style="margin-bottom: 32px;">
        <h1 style="font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Le Blog Dokkena : Guides & Conseils</h1>
        <p style="color: #64748b; font-size: 16px;">Retrouvez nos analyses d'experts, comparatifs et guides pratiques pour faire les meilleurs choix shopping en Tunisie.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
        @for (post of posts; track post.slug) {
          <article style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="height: 200px; overflow: hidden; position: relative;">
              <img [src]="post.image" [alt]="post.title" style="width: 100%; height: 100%; object-fit: cover;" />
              <span style="position: absolute; top: 12px; left: 12px; background: rgba(15, 23, 42, 0.85); color: #fff; font-size: 12px; padding: 4px 10px; border-radius: 20px; font-weight: 500;">
                {{ post.category }}
              </span>
            </div>
            <div style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1;">
              <div style="font-size: 13px; color: #94a3b8; margin-bottom: 8px;">
                {{ post.date }} • {{ post.readTime }}
              </div>
              <h2 style="font-size: 19px; font-weight: 600; line-height: 1.4; margin-bottom: 12px;">
                <a [routerLink]="['/blog', post.slug]" style="color: #0f172a; text-decoration: none;">
                  {{ post.title }}
                </a>
              </h2>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 20px; flex-grow: 1;">
                {{ post.excerpt }}
              </p>
              <div>
                <a [routerLink]="['/blog', post.slug]" style="color: #4f46e5; font-weight: 600; text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 4px;">
                  Lire l'article complet →
                </a>
              </div>
            </div>
          </article>
        }
      </div>
    </div>
  `
})
export class BlogListComponent implements OnInit {
  private seoService = inject(SeoService);
  posts: BlogPost[] = BLOG_POSTS;

  ngOnInit(): void {
    this.seoService.update({
      title: 'Blog & Guides d\'Achat | Conseils High-Tech, Maison & Tendances Dokkena',
      description: 'Découvrez nos guides d\'achat complets, comparatifs produits et conseils d\'experts pour réussir vos achats en ligne en Tunisie avec Dokkena.',
      path: '/blog'
    });
    this.seoService.setBreadcrumbJsonLd([
      { name: 'Accueil', url: '/' },
      { name: 'Blog', url: '/blog' }
    ]);
  }
}

