import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  
  // הכתובת הבסיסית לכל פעולות ההזמנה
  readonly BASE_URL = `${environment.apiUrl}/api/Orders`; 

  /**
   * שליפת הזמנות של משתמש
   * תיקון: שינוי ה-URL כדי שיפנה ל-OrdersController שבו ה-ID מחולץ נכון
   */
  getUserOrders(userId: number): Observable<any> {
    console.log(`[OrderService] Fetching orders for userId: ${userId} from ${this.BASE_URL}/user/${userId}`);
    
    return this.http.get<any>(`${this.BASE_URL}/user/${userId}`).pipe(
      tap(res => console.log('[OrderService] Data received from server:', res))
    );
  }

  /**
   * סגירת הזמנה (מעבר מטיוטה לבוצע)
   */
  // completeOrder(orderId: number): Observable<boolean> {
  //   console.log(`[OrderService] Sending completeOrder request for ID: ${orderId}`);
  //   return this.http.post<boolean>(`${this.BASE_URL}/complete/${orderId}`, {});
  // }
  completeOrder(orderId: number): Observable<any> {
  // מוסיפים responseType: 'text' כדי שלא ינסה להפוך את המילים "ההזמנה הושלמה" ל-JSON
  return this.http.post(`${this.BASE_URL}/complete/${orderId}`, {}, { responseType: 'text' });
}
  /**
   * הוספה או עדכון של מתנה בסל
   */
  addOrUpdateGiftInOrder(userId: number, giftId: number, amount: number): Observable<boolean> {
    const body = { userId, giftId, amount };
    return this.http.post<boolean>(`${this.BASE_URL}/add-gift`, body);
  }

  /**
   * עדכון כמות חבילות
   */
  updatePackageQuantity(userId: number, packageId: number, quantity: number): Observable<boolean> {
    const body = { userId, packageId, quantity }; 
    return this.http.post<boolean>(`${this.BASE_URL}/update-package`, body);
  }

  /**
   * שליפת שמות הרוכשים (עבור הגרלה)
   */
  getPurchasersByGiftId(giftId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.BASE_URL}/purchasers/${giftId}`);
  }

}