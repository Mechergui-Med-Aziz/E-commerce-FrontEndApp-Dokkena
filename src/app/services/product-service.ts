import { HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { Product } from '../classes/product';
import { CartItem } from '../classes/cart-item';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  //private apiUrl="https://dbchallengeserver.onrender.com/product"
  //private apiUrl="https://dbchallengeserver.onrender.com/product"

  private apiUrl=environment.apiUrl+"product";
  
 
  constructor(private http:HttpClient) {
    
   }


  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all`).pipe(
      map(response => {
        console.log('Response:', response);
        return response as Product[];
      }),
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  getProductById(id:number){
    return this.http.get(`${this.apiUrl}/id/${id}`).pipe(
      map(response => {
        console.log('Response:', response);
        return response as Product;
      }),
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  getProductsOnSale():Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}/onSale`).pipe(
      map(response => {
        console.log('Response:', response);
        return response as Product[];
      }),
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    )
  }

  getDiscountPercentage(originalPrice:number,price:number):number{
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  getFeaturedProducts(){
    return this.http.get(`${this.apiUrl}/featured`).pipe(
      map(response => {
        console.log('Response:', response);
        return response as Product[];
      }),
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  deleteProduct(id:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  getProductsByCategory(category:string):Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`).pipe(
      map(response=>{
        console.log('Response:', response);
        return response as Product[];
      }),
      catchError(error=>{
        console.error('Error:', error);
        throw error;
      }
    ));
  }
}
