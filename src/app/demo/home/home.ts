import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Product } from 'src/app/classes/product';
import { Category } from 'src/app/classes/category';
import { ProductService } from 'src/app/services/product-service';
import { CategoryService } from 'src/app/services/category-service';
import { Router, RouterModule } from '@angular/router';
import { BasketService } from 'src/app/services/basket-service';
import { SeoService } from 'src/app/services/seo-service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  public productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private basketService = inject(BasketService);
  private router = inject(Router);
  private seoService = inject(SeoService);

  products: Product[] = [];
  categories: Category[] = [];
  currentSlide = 0;
  sliderInterval: any = null;
  productsOnSale: Product[] = [];
  showToast = false;
  toastMessage = '';
  toastType = 'success';

  ngOnInit() {
    this.seoService.update({
      title: 'Dokkena | Boutique en ligne : High-Tech, Mode, Beauté, Sport en Tunisie',
      description: 'Dokkena, boutique e-commerce en Tunisie. Large sélection High-Tech, Mode, Beauté, Cuisine, Gaming et Sport au meilleur prix avec livraison rapide.',
      path: '/'
    });
    this.seoService.setOrganizationAndWebsiteJsonLd();

    this.productService
      .getAllProducts()
      .pipe(catchError(() => of([])))
      .subscribe((data: Product[]) => {
        this.products = [...data];
        this.productsOnSale = data.filter((product) => product.isOnSale === true);
      });

    this.categoryService
      .getAllCategories()
      .pipe(catchError(() => of([])))
      .subscribe((data: Category[]) => {
        this.categories = [...data];
      });

    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy() {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
      this.sliderInterval = null;
    }
  }

  startAutoSlide() {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    if (this.productsOnSale.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.productsOnSale.length;
    }
  }

  prevSlide() {
    if (this.productsOnSale.length > 0) {
      this.currentSlide = (this.currentSlide - 1 + this.productsOnSale.length) % this.productsOnSale.length;
    }
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  getFeaturedProducts(): Product[] {
    return this.products.filter((product) => product.isFeatured);
  }

  getProductsOnSale(): Product[] {
    return this.products.filter((product) => product.isOnSale);
  }

  getDiscountPercentage(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating || 0);
    const halfStar = (rating || 0) % 1 >= 0.5 ? 1 : 0;
    const emptyStars = Math.max(0, 5 - fullStars - halfStar);
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
  }

  addToBasket(product: Product) {
    if (!this.basketService.addToBasket(product)) {
      this.toastMessage = 'Ce produit est déjà dans votre panier.';
      this.toastType = 'error';
    } else {
      this.toastMessage = 'Produit ajouté au panier.';
      this.toastType = 'success';
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

  openDetails(product: Product) {
    this.router.navigate(['/product', this.productService.generateSlug(product)], { state: { data: product } });
  }
}
