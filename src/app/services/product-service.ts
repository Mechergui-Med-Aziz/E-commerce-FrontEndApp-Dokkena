import { HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../classes/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl="http://localhost:3000/product"
  //private http=inject(HttpClient)
  constructor(private http:HttpClient) { }

  // eslint-disable-next-line @angular-eslint/prefer-inject
  //constructor(private httpq:HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id:number){
    return this.http.get(`${this.apiUrl}/${id}`)
  }

  getProductsOnSale():Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}?isOnSale=true`)
  }

  getDiscountPercentage(originalPrice:number,price:number):number{
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  getFeaturedProducts(){
    return this.http.get(`${this.apiUrl}?isFeatured=true`)
  }

  deleteProduct(id:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
