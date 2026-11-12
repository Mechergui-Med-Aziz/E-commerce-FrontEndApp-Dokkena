import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, share } from 'rxjs';
import { Product } from 'src/app/classes/product';
import { BasketService } from 'src/app/services/basket-service';
import { ProductService } from 'src/app/services/product-service';
import { SeoService } from 'src/app/services/seo-service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-kitchen',
  imports: [SharedModule, CommonModule],
  templateUrl: './kitchen.html',
  styleUrl: './kitchen.scss'
})
export class Kitchen implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private productService = inject(ProductService);
  private basketService = inject(BasketService);
  private router = inject(Router);
  private seoService = inject(SeoService);

  products: Product[] = [];
  showToast = false;
  toastMessage = '';
  toastType = 'success';

  searchQuery = '';
  selectedSortOption = 'featured';
  filteredProducts: any[] = [];
  displayedProducts: any[] = [];

  ngOnInit(): void {
    this.seoService.update({
      title: 'Cuisine & Maison en Tunisie : Petit Électroménager, Ustensiles | Dokkena',
      description: 'Équipez votre cuisine sur Dokkena Tunisie : robots multifonctions, cafetières, mixeurs, casseroles et ustensiles indispensables pour la maison.',
      path: '/categories/kitchen'
    });
    this.seoService.setBreadcrumbJsonLd([
      { name: 'Accueil', url: '/' },
      { name: 'Catégories', url: '/product-list' },
      { name: 'Cuisine & Maison', url: '/categories/kitchen' }
    ]);

    this.productService
      .getProductsByCategory('Kitchen')
      .pipe(
        share(),
        catchError(() => of([]))
      )
      .subscribe((data) => {
        this.products = [...data];
        this.filteredProducts = [...data];
        this.displayedProducts = [...data];
        this.seoService.setCategoryJsonLd('Cuisine & Maison', '/categories/kitchen', data);
      });
  }

  filterProducts(): void {
    if (!this.searchQuery) {
      this.filteredProducts = [...this.products];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query))
      );
    }
    this.sortProducts();
  }

  sortProducts(): void {
    let sortedProducts = [...this.filteredProducts];

    switch (this.selectedSortOption) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'sale':
        sortedProducts = sortedProducts.filter((product) => product.isOnSale);
        break;
      default:
        break;
    }

    this.displayedProducts = sortedProducts;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterProducts();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedSortOption = 'featured';
    this.filterProducts();
  }

  getFeaturedProducts(): Product[] {
    return this.products.filter((product) => product.isFeatured);
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
