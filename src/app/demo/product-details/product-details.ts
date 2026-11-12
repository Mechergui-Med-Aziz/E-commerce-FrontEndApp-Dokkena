import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from 'src/app/classes/product';
import { BasketService } from 'src/app/services/basket-service';
import { ProductService } from 'src/app/services/product-service';
import { SeoService } from 'src/app/services/seo-service';
import { AnalyticsService } from 'src/app/services/analytics-service';
import { UserPreferenceService } from 'src/app/services/user-preference.service';
import { environment } from 'src/environments/environment';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private basketService = inject(BasketService);
  public productService = inject(ProductService);
  private seoService = inject(SeoService);
  private analyticsService = inject(AnalyticsService);
  private userPreferenceService = inject(UserPreferenceService);

  data?: Product;
  similarProducts: Product[] = [];
  recentlyViewed: Product[] = [];
  isInWishlist = false;
  toastMessage = '';
  showToast = false;
  toastType = 'success';
  selectedImage = '';
  quantity = 1;

  constructor() {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['data']) {
      this.data = nav.extras.state['data'];
    }
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    const queryId = this.route.snapshot.queryParamMap.get('id');
    const idToFetch = paramId ? this.productService.extractIdFromSlug(paramId) : queryId;

    if (this.data) {
      this.handleProductLoaded(this.data);
    }

    if (idToFetch && (!this.data || String(this.data.id) !== String(idToFetch))) {
      this.productService
        .getProductById(idToFetch)
        .pipe(catchError(() => of(null)))
        .subscribe({
          next: (product: any) => {
            if (product) {
              this.data = product;
              this.handleProductLoaded(product);
            }
          }
        });
    }

    if (isPlatformBrowser(this.platformId)) {
      this.recentlyViewed = this.userPreferenceService
        .getRecentlyViewed()
        .filter((p) => !this.data || String(p.id) !== String(this.data.id))
        .slice(0, 4);
    }
  }

  private handleProductLoaded(product: Product): void {
    if (product.image) {
      this.selectedImage = product.image;
    }
    this.applySeo(product);
    this.loadSimilarProducts(product.category, product.id);

    if (isPlatformBrowser(this.platformId)) {
      this.userPreferenceService.addToRecentlyViewed(product);
      this.isInWishlist = this.userPreferenceService.isInWishlist(product.id);
      this.analyticsService.trackViewItem({
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1
      });
    }
  }

  toggleWishlist(): void {
    if (!this.data) return;
    this.isInWishlist = this.userPreferenceService.toggleWishlist(this.data.id);
    this.showToastMessage(
      this.isInWishlist
        ? 'Produit ajouté à votre liste de souhaits !'
        : 'Produit retiré de votre liste de souhaits.'
    );
  }

  shareWhatsApp(): void {
    if (!isPlatformBrowser(this.platformId) || !this.data) return;
    const url = window.location.href;
    const text = encodeURIComponent(`Regarde ce produit sur Dokkena : ${this.data.name} à ${this.data.price} DT ! ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  shareFacebook(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  copyLink(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      navigator.clipboard.writeText(window.location.href);
      this.showToastMessage('Lien du produit copié dans le presse-papier !');
    } catch {
      this.showToastMessage('Impossible de copier le lien.');
    }
  }

  private loadSimilarProducts(category?: string, currentId?: any): void {
    if (!category) return;
    this.productService
      .getProductsByCategory(category)
      .pipe(catchError(() => of([])))
      .subscribe((products: Product[]) => {
        this.similarProducts = products
          .filter((p) => String(p.id) !== String(currentId))
          .slice(0, 4);
      });
  }

  private applySeo(product: any): void {
    if (!product) return;
    const name = product.name || product.title || 'Produit Dokkena';
    const priceStr = product.price ? `${product.price} TND` : '';
    const title = `${name} - Acheter au meilleur prix (${priceStr}) | Dokkena`;
    const description = product.description && product.description.length > 20
      ? `${name} : ${product.description.slice(0, 130)}... Achetez en ligne sur Dokkena Tunisie avec livraison rapide.`
      : `Achetez ${name} au meilleur prix (${priceStr}) sur Dokkena Tunisie. Livraison rapide partout en Tunisie et paiement sécurisé.`;
    const slug = this.productService.generateSlug(product);
    const path = `/product/${slug}`;

    this.seoService.update({
      title,
      description,
      path,
      image: product.image || product.imageUrl,
      type: 'product'
    });

    this.seoService.setProductJsonLd(product, path);
    this.seoService.setBreadcrumbJsonLd([
      { name: 'Accueil', url: '/' },
      { name: product.category || 'Catalogue', url: product.category ? `/categories/${product.category.toLowerCase()}` : '/product-list' },
      { name, url: path }
    ]);
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  calculateDiscount() {
    if (!this.data?.originalPrice || !this.data?.price) return 0;
    return Math.round(100 - (this.data.price / this.data.originalPrice) * 100);
  }

  getStarRating() {
    return Math.floor(this.data?.rating || 0);
  }

  hasMultipleImages() {
    return !!(this.data?.image2 || this.data?.image3);
  }

  handleImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
  }

  addToBasket(product: Product) {
    if (!this.basketService.addToBasket(product, this.quantity)) {
      this.toastMessage = 'Ce produit est déjà dans votre panier.';
      this.toastType = 'error';
    } else {
      this.toastMessage = 'Produit ajouté au panier.';
      this.toastType = 'success';
      this.analyticsService.trackAddToCart({
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: this.quantity
      });
    }
    this.showToastMessage(this.toastMessage);
  }

  showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }
  }
}
