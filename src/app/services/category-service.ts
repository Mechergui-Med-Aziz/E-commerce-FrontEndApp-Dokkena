import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl="https://dbchallengeserver.onrender.com/category"

  constructor(private http: HttpClient) { }

  getAllCategories(){
    return this.http.get(this.apiUrl);
  }
  


}
