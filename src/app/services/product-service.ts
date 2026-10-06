import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { Product } from '../classes/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl + 'api/product';

  constructor(private http: HttpClient) {}

  getImageUrl(image?: string | null): string {
    if (!image) {
      return 'assets/images/no-image.png';
    }
  
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
  
    return 'http://localhost:8080' + image;
  }

  // =====================================================
  // GET ALL PRODUCTS
  // =====================================================

  getAllProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.apiUrl}/all`
    ).pipe(
      catchError(error => {
        console.error('Erreur récupération produits :', error);
        return throwError(() => error);
      })
    );
  }

  // =====================================================
  // GET PRODUCT BY ID
  // =====================================================

  getProductById(id: number): Observable<Product> {

    return this.http.get<Product>(
      `${this.apiUrl}/id/${id}`
    ).pipe(
      catchError(error => {
        console.error('Erreur récupération produit :', error);
        return throwError(() => error);
      })
    );
  }

  // =====================================================
  // GET PRODUCTS BY CATEGORY
  // =====================================================

  getProductsByCategory(category: string): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.apiUrl}/category/${category}`
    ).pipe(
      catchError(error => {
        console.error('Erreur catégorie :', error);
        return throwError(() => error);
      })
    );
  }

  // =====================================================
  // GET PRODUCTS ON SALE
  // =====================================================

  getProductsOnSale(): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.apiUrl}/onSale`
    ).pipe(
      catchError(error => {
        console.error('Erreur produits en promotion :', error);
        return throwError(() => error);
      })
    );
  }

  // =====================================================
  // GET FEATURED PRODUCTS
  // =====================================================

  getFeaturedProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.apiUrl}/featured`
    ).pipe(
      catchError(error => {
        console.error('Erreur produits featured :', error);
        return throwError(() => error);
      })
    );
  }

  // =====================================================
  // CREATE PRODUCT
  // =====================================================

  createProduct(
    product: Product,
    image?: File,
    image2?: File,
    image3?: File
  ): Observable<Product> {

    const formData = new FormData();

    // Produit JSON
    formData.append(
      'product',
      new Blob(
        [JSON.stringify(product)],
        {
          type: 'application/json'
        }
      )
    );

    // Image 1
    if (image) {
      formData.append(
        'image',
        image
      );
    }

    // Image 2
    if (image2) {
      formData.append(
        'image2',
        image2
      );
    }

    // Image 3
    if (image3) {
      formData.append(
        'image3',
        image3
      );
    }

    return this.http.post<Product>(
      `${this.apiUrl}/create`,
      formData
    ).pipe(
      catchError(error => {
        console.error('Erreur création produit :', error);
        return throwError(() => error);
      })
    );
  }

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  updateProduct(
    id: number,
    product: Product,
    image?: File,
    image2?: File,
    image3?: File
  ): Observable<Product> {

    const formData = new FormData();

    // Produit JSON
    formData.append(
      'product',
      new Blob(
        [JSON.stringify(product)],
        {
          type: 'application/json'
        }
      )
    );

    // Nouvelles images
    if (image) {
      formData.append(
        'image',
        image
      );
    }

    if (image2) {
      formData.append(
        'image2',
        image2
      );
    }

    if (image3) {
      formData.append(
        'image3',
        image3
      );
    }

    return this.http.put<Product>(
      `${this.apiUrl}/update/${id}`,
      formData
    ).pipe(
      catchError(error => {
        console.error('Erreur modification produit :', error);
        return throwError(() => error);
      })
    );
  }

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  deleteProduct(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/delete/${id}`
    ).pipe(
      catchError(error => {
        console.error('Erreur suppression produit :', error);
        return throwError(() => error);
      })
    );
  }

  // =====================================================
  // DISCOUNT
  // =====================================================

  getDiscountPercentage(
    originalPrice: number,
    price: number
  ): number {

    if (!originalPrice || originalPrice <= 0) {
      return 0;
    }

    return Math.round(
      ((originalPrice - price) / originalPrice) * 100
    );
  }
}