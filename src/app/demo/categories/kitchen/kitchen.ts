import { S } from '@angular/cdk/scrolling-module.d-C_w4tIrZ';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { share } from 'rxjs';
import { CartItem } from 'src/app/classes/cart-item';
import { Product } from 'src/app/classes/product';
import { BasketService } from 'src/app/services/basket-service';
import { ProductService } from 'src/app/services/product-service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-kitchen',
  imports: [SharedModule,CommonModule],
  templateUrl: './kitchen.html',
  styleUrl: './kitchen.scss',
  providers: [ProductService]
})
export class Kitchen implements OnInit {
  constructor(private productService:ProductService, private basketService:BasketService,private router:Router) {}

   products:Product[]=[];
   //basket:CartItem[]=[];
     showToast = false;
     toastMessage = '';
     toastType='success';
     searchQuery: string = '';
     selectedSortOption: string = '---';
     filteredProducts: any[] = [];
     displayedProducts: any[] = [];
  
    ngOnInit(): void {
      this.productService.getProductsByCategory("Kitchen").pipe(share()).subscribe((data)=>{
        this.products=[...data];
        console.log(data);
        this.filteredProducts = [...data];
          this.displayedProducts = [...data];
      });
    }
  
  
  
    getDiscountPercentage(product: Product): number {
      if (!product.originalPrice) return 0;
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
  
    getStarRating(rating: number): string {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5 ? 1 : 0;
      const emptyStars = 5 - fullStars - halfStar;
      
      return '★'.repeat(fullStars) + '½'.repeat(halfStar) + '☆'.repeat(emptyStars);
    }

    addToBasket(product: Product) {
      
      if(!this.basketService.addToBasket(product)){
        this.toastMessage = 'Ce produit est déja dans votre panier.';
        this.toastType="error";
      }
      else{
        this.toastMessage = 'Produit ajouté au panier.';
        this.toastType="success"
      }
      this.showToastMessage(this.toastMessage);
    }
    showToastMessage(message: string): void {
      this.toastMessage = message;
      this.showToast = true;
  
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }

    openDetails(product: Product) {
      this.router.navigate(['/product-details'], { state: {data: product} });
    }

    filterProducts(): void {
      if (!this.searchQuery) {
        this.filteredProducts = [...this.products];
      } else {
        const query = this.searchQuery.toLowerCase();
        this.filteredProducts = this.products.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.category.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query))
        );
      }
      this.sortProducts();
    }

    sortProducts(): void {
      let sortedProducts = [...this.filteredProducts];
      
      switch(this.selectedSortOption) {
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
          sortedProducts = sortedProducts.filter(product => product.onSale);
          break;
          case '---':
            sortedProducts = [...this.filteredProducts];
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
      this.selectedSortOption = '---';
      this.filterProducts();
    }


}
