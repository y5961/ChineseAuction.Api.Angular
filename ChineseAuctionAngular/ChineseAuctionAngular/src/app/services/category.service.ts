
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateGiftCategoryDTO, GiftCategoryDTO, UpdateGiftCategoryDTO } from '../models/CategoryDTO';
@Injectable({
  providedIn: 'root'
})
export class GiftCategoryService {
  readonly BASE_URL="api/GiftCategory";

  constructor(private http: HttpClient) {}

  // 1. קבלת כל הקטגוריות - GetAllAsync
  getAllCategories(): Observable<GiftCategoryDTO[]> {
    return this.http.get<GiftCategoryDTO[]>(this.BASE_URL);
  }

  // 2. קבלת קטגוריה לפי מזהה - GetByIdAsync
  getCategoryById(id: number): Observable<GiftCategoryDTO> {
    return this.http.get<GiftCategoryDTO>(`${this.BASE_URL}/${id}`);
  }

  // 3. יצירת קטגוריה חדשה - CreateAsync
  createCategory(dto: CreateGiftCategoryDTO): Observable<GiftCategoryDTO> {
    return this.http.post<GiftCategoryDTO>(this.BASE_URL, dto);
  }

  // 4. עדכון קטגוריה קיימת - UpdateAsync
  updateCategory(id: number, dto: UpdateGiftCategoryDTO): Observable<boolean> {
    return this.http.put<boolean>(`${this.BASE_URL}/${id}`, dto);
  }

  // 5. מחיקת קטגוריה - DeleteAsync
  deleteCategory(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.BASE_URL}/${id}`);
  }
}