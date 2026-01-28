// src/app/services/order.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  readonly BASE_URL = "/api/Orders"; 

  // עדכון כמות (עובד לפי ה-Swagger שלך)
  updatePackageQuantity(userId: number, packageId: number, quantity: number): Observable<boolean> {
    const body = { userId, packageId, quantity }; 
    return this.http.post<boolean>(`${this.BASE_URL}/update-package`, body);
  }

  // שליפת הזמנות (הנתיב המדויק מה-Swagger תחת User)
  getUserOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/User/${userId}/orders`);
  }
}