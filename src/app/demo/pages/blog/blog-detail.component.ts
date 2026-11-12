import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BLOG_POSTS, BlogPost } from 'src/app/services/blog-data';
import { SeoService } from 'src/app/services/seo-service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4" style="max-width: 860px; margin: 0 auto; padding: 24px 16px;">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb" style="display: flex; gap: 8px; list-style: none; padding: 0; font-size: 14px; color: #64748b;">
          <li><a routerLink="/" style="color: #4f46e5; text-decoration: none;">Accueil</a></li>
          <li>/</li>
          <li><a routerLink="/blog" style="color: #4f46e5; text-decoration: none;">Blog</a></li>
          <li>/</li>
          <li class="active" aria-current="page" style="color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 300px;">
            {{ post?.title }}
          </li>
        </ol>
      </nav>

      @if (post) {
        <article>
          <header style="margin-bottom: 24px;">
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
              <span style="background: #eef2ff; color: #4338ca; font-size: 13px; font-weight: 600; padding: 4px 12px; border-radius: 20px;">
                {{ post.category }}
              </span>
              <span style="font-size: 13px; color: #64748b;">{{ post.date }}</span>
              <span style="font-size: 13px; color: #64748b;">• {{ post.readTime }}</span>
            </div>
            <h1 style="font-size: 32px; font-weight: 800; line-height: 1.3; color: #0f172a; margin-bottom: 16px;">
              {{ post.title }}
            </h1>
            <div style="font-size: 14px; color: #64748b;">
              Rédigé par <strong>{{ post.author }}</strong>
            </div>
          </header>

          <div style="border-radius: 12px; overflow: hidden; margin-bottom: 32px; max-height: 420px;">
            <img [src]="post.image" [alt]="post.title" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>

          <div class="article-body" [innerHTML]="post.content" style="line-height: 1.9; font-size: 16px; color: #334155;">
          </div>

          <!-- Maillage interne vers la boutique -->
          <div style="margin-top: 48px; padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center;">
            <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #0f172a;">Envie de vous équiper au meilleur prix ?</h3>
            <p style="color: #64748b; font-size: 15px; margin-bottom: 16px;">
              Retrouvez l'ensemble de notre catalogue {{ post.category }} sélectionné avec soin chez Dokkena.
            </p>
            <a [routerLink]="['/categories', post.categorySlug]" class="btn btn-primary" style="background: #4f46e5; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              Découvrir la catégorie {{ post.category }} →
            </a>
          </div>
        </article>
      } @else {
        <div style="text-align: center; padding: 48px;">
          <h2>Article introuvable</h2>
          <p style="color: #64748b;">Cet article n'existe pas ou a été déplacé.</p>
          <a routerLink="/blog" style="color: #4f46e5; font-weight: 600;">← Retourner au blog</a>
        </div>
      }
    </div>
  `
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);
  post?: BlogPost;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.post = BLOG_POSTS.find((p) => p.slug === slug);
      if (this.post) {
        const path = `/blog/${this.post.slug}`;
        this.seoService.update({
          title: `${this.post.title} | Blog Dokkena`,
          description: this.post.excerpt,
          path,
          image: this.post.image,
          type: 'article'
        });
        this.seoService.setBreadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: this.post.title, url: path }
        ]);
        this.seoService.setJsonLd('schema-blogposting', {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: this.post.title,
          description: this.post.excerpt,
          image: [this.post.image],
          datePublished: this.post.date,
          author: {
            '@type': 'Person',
            name: this.post.author
          },
          publisher: {
            '@type': 'Organization',
            name: 'Dokkena',
            logo: {
              '@type': 'ImageObject',
              url: 'https://dokkena.vercel.app/assets/images/logo-dark.png'
            }
          }
        });
      }
    }
  }
}

