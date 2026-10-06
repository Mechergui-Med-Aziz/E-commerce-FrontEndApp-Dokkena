import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Category } from '../classes/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl =
    environment.apiUrl.replace(/\/$/, '') + '/api/category';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.apiUrl}/all`
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(
      `${this.apiUrl}/id/${id}`
    );
  }

  getCategoryByName(name: string): Observable<Category> {
    return this.http.get<Category>(
      `${this.apiUrl}/name/${encodeURIComponent(name)}`
    );
  }

  createCategory(
    category: Category,
    image?: File
  ): Observable<Category> {

    const formData = new FormData();

    const categoryBlob = new Blob(
      [
        JSON.stringify({
          name: category.name
        })
      ],
      {
        type: 'application/json'
      }
    );

    formData.append(
      'category',
      categoryBlob
    );

    if (image) {
      formData.append(
        'image',
        image,
        image.name
      );
    }

    return this.http.post<Category>(
      `${this.apiUrl}/create`,
      formData
    );
  }

  updateCategory(
    id: number,
    category: Category,
    image?: File
  ): Observable<Category> {

    const formData = new FormData();

    const categoryBlob = new Blob(
      [
        JSON.stringify({
          name: category.name
        })
      ],
      {
        type: 'application/json'
      }
    );

    formData.append(
      'category',
      categoryBlob
    );

    if (image) {
      formData.append(
        'image',
        image,
        image.name
      );
    }

    return this.http.put<Category>(
      `${this.apiUrl}/update/${id}`,
      formData
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/delete/${id}`
    );
  }
}