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
  
    ngOnInit(): void {
      this.productService.getProductsByCategory("Kitchen").pipe(share()).subscribe((data)=>{
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
