import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { share } from 'rxjs';
import { Product } from 'src/app/classes/product';
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
  constructor(private productService:ProductService) {}

   products:Product[]=[];
  
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

}