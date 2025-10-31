import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { share } from 'rxjs';
import { CartItem } from 'src/app/classes/cart-item';
import { Product } from 'src/app/classes/product';
import { BasketService } from 'src/app/services/basket-service';
import { ProductService } from 'src/app/services/product-service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-fashion',
  imports: [SharedModule,CommonModule],
  templateUrl: './fashion.html',
  styleUrl: './fashion.scss',
  providers: [ProductService]
})
export class Fashion implements OnInit {
  constructor(private productService:ProductService, private basketService:BasketService, private router:Router) {}

   products:Product[]=[];
  // basket:CartItem[]=[];
     showToast = false;
     toastMessage = '';
     toastType='success';
  
    ngOnInit(): void {
      this.productService.getProductsByCategory("Fashion").pipe(share()).subscribe((data)=>{
        this.products=[...data];
        console.log(data);
      });
    }
  
    getFeaturedProducts(): Product[] {
      return this.products.filter(product => product.isFeatured);
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
}