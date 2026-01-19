import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CategoryDto , GetCategoryDto } from '../models/CategoryDto';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class Category {
  private readonly BASE_URL = 'https://localhost:7157/api/Category';
  private http = inject(HttpClient);

  constructor() {}

  /** GET: שליפת כל הקטגוריות */
  getAllCategories(): Observable<GetCategoryDto[]> {
    return this.http.get<GetCategoryDto[]>(this.BASE_URL);
  }

  /** POST: הוספת קטגוריה חדשה */
  addCategory(category: CategoryDto): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(this.BASE_URL, category);
  }

  /** GET: שליפת קטגוריה לפי מזהה (ID) */
  getCategoryById(id: number): Observable<GetCategoryDto> {
    return this.http.get<GetCategoryDto>(`${this.BASE_URL}/${id}`);
  }

  /** PUT: עדכון קטגוריה קיימת */
  updateCategory(id: number, category: CategoryDto): Observable<void> {
    return this.http.put<void>(`${this.BASE_URL}/${id}`, category);
  }

  /** DELETE: מחיקת קטגוריה */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
}

