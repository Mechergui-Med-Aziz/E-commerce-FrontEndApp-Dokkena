import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/classes/product';
import { BasketService } from 'src/app/services/basket-service';
import { ProductService } from 'src/app/services/product-service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private basketService = inject(BasketService);
  private productService = inject(ProductService);

  data?: Product;
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

    if (idToFetch && (!this.data || String(this.data.id) !== String(idToFetch))) {
      this.productService
        .getProductById(idToFetch)
        .pipe(catchError(() => of(null)))
        .subscribe({
          next: (product: any) => {
            if (product) {
              this.data = product;
              if (product?.image) {
                this.selectedImage = product.image;
              }
            }
          }
        });
    } else if (this.data?.image) {
      this.selectedImage = this.data.image;
    }
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
