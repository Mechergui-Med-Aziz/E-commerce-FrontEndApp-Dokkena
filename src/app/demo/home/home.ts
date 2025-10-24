import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Product } from 'src/app/classes/product';
import { Category } from 'src/app/classes/category';
import { ProductService } from 'src/app/services/product-service';
import { CategoryService } from 'src/app/services/category-service';

@Component({
  selector: 'app-home',
  imports: [CommonModule,SharedModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  providers:[ProductService,CategoryService]
})

export class Home implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  currentSlide = 0;
  sliderInterval: undefined | ReturnType<typeof setInterval>;
  productsOnSale:Product[]=[];

 constructor(private productService:ProductService,private categoryService:CategoryService) { }


  ngOnInit() {
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.products = [...data];
      console.log(this.products);
      this.productsOnSale=data.filter(product=>product.isOnSale==true);
      console.log(this.productsOnSale);
    });

    this.categoryService.getAllCategories().subscribe((data: Category[]) => {
      this.categories = [...data];
      console.log(this.categories);
    });
    
    this.startAutoSlide();
  }

  ngOnDestroy() {
    // Nettoyer l'intervalle
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  deleteobject(id:number){
    this.productService.deleteProduct(id).subscribe(()=>{
      this.products=this.products.filter(product=>product.id!==id);
      console.log(this.products);
    });
  }

  // Méthodes pour le slider
  startAutoSlide() {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.productsOnSale.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.productsOnSale.length) % this.productsOnSale.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  // Méthodes utilitaires
  getFeaturedProducts(): Product[] {
    return this.products.filter(product => product.isFeatured);
  }

  getProductsOnSale(): Product[] {
    return this.products.filter(product => product.isOnSale);
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


