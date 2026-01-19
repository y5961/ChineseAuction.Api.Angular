import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PackageDTO, PackageCreateDTO } from '../models/PackageDTO';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  // כתובת ה-API כפי שמופיעה ב-Controller בדרך כלל
  readonly BASE_URL = "api/Packages";
  private http = inject(HttpClient);

  constructor() {}

  // 1. קבלת כל החבילות
  getAllPackages(): Observable<PackageDTO[]> {
    return this.http.get<PackageDTO[]>(`${this.BASE_URL}`);
  }

  // 2. קבלת חבילה לפי מזהה
  getPackageById(id: number): Observable<PackageDTO> {
    return this.http.get<PackageDTO>(`${this.BASE_URL}/${id}`);
  }

  // 3. יצירת חבילה חדשה
  createPackage(dto: PackageCreateDTO): Observable<number> {
    return this.http.post<number>(`${this.BASE_URL}`, dto);
  }

  // 4. עדכון חבילה קיימת
  updatePackage(id: number, dto: PackageCreateDTO): Observable<void> {
    return this.http.put<void>(`${this.BASE_URL}/${id}`, dto);
  }

  // 5. מחיקת חבילה
  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
}