import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  // וודאי שה-URL הזה תואם ל-Route ב-Controller של ה-Orders ב-API שלך
  readonly BASE_URL = `${environment.apiUrl}/api/Orders`; 
// שליפת שמות הרוכשים עבור הגרלה של מתנה ספציפית
  // הפונקציה מחזירה מערך של שמות (למשל: ["ישראל ישראלי", "משה כהן", "ישראל ישראלי"])
  getPurchasersByGiftId(giftId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.BASE_URL}/purchasers/${giftId}`);
  }

  // עדכון כמות חבילות
  updatePackageQuantity(userId: number, packageId: number, quantity: number): Observable<boolean> {
    const body = { userId, packageId, quantity }; 
    return this.http.post<boolean>(`${this.BASE_URL}/update-package`, body);
  }

  addOrUpdateGiftInOrder(userId: number, giftId: number, amount: number): Observable<boolean> {
    const body = { userId, giftId, amount };
    return this.http.post<boolean>(`${this.BASE_URL}/add-gift`, body);
  }

  getUserOrders(userId: number): Observable<any> {
    // מומלץ להשתמש ב-BASE_URL או בנתיב מלא עקבי
    return this.http.get<any>(`${environment.apiUrl}/api/User/${userId}/orders`);
  }
}