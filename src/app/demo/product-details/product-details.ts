import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/classes/product';
import { BasketService } from 'src/app/services/basket-service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails {
  data:Product
  toastMessage:string='';
  //basket:CartItem[]=[];
  showToast = false;
  toastType = 'success';

   constructor(private router: Router,private basketService:BasketService) {
    const nav = this.router.getCurrentNavigation();
    this.data = nav?.extras?.state?.['data'];
  }
  selectedImage = '';
quantity = 1;

selectImage(img: string) {
  this.selectedImage = img;
}



calculateDiscount() {
  return Math.round(100 - (this.data.price / this.data.originalPrice * 100));
}

getStarRating() {
  return Math.floor(this.data.rating);
}

hasMultipleImages() {
  return this.data.image2 || this.data.image3;
}

handleImageError(event: any) {
  event.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
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



}
