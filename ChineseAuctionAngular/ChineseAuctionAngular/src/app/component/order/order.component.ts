import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  // וודאי שה-URL הזה תואם ל-Route ב-Controller של ה-Orders ב-API שלך
  readonly BASE_URL = "/api/Orders"; 

  // עדכון כמות חבילות
  updatePackageQuantity(userId: number, packageId: number, quantity: number): Observable<boolean> {
    const body = { userId, packageId, quantity }; 
    return this.http.post<boolean>(`${this.BASE_URL}/update-package`, body);
  }

  // שליפת הזמנות
  getUserOrders(userId: number): Observable<any> {
    return this.http.get<any>(`/api/User/${userId}/orders`);
  }

addOrUpdateGiftInOrder(userId: number, giftId: number, amount: number): Observable<boolean> {
  const body = { userId, giftId, amount };
  return this.http.post<boolean>(`${this.BASE_URL}/add-gift`, body);
}
}