import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  //private apiUrl="https://dbchallengeserver.onrender.com/category"
  //private apiUrl="https://dbchallengeserver.onrender.com/category"
  private apiUrl=environment.apiUrl+"category"
  constructor(private http: HttpClient) { }

  getAllCategories(){
    return this.http.get(this.apiUrl+"/all");
  }
  


}
