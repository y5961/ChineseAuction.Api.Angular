import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDTO } from '../models/OrderDTO';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  readonly BASE_URL = "api/Orders";
  private http = inject(HttpClient);

  constructor() {}

  // 1. קבלת כל ההזמנות של משתמש מסוים
  getAllOrders(userId: number): Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(`${this.BASE_URL}/user/${userId}`);
  }

  // 2. קבלת הזמנת טיוטה (Draft) של משתמש
  getDraftOrder(userId: number): Observable<OrderDTO | null> {
    return this.http.get<OrderDTO>(`${this.BASE_URL}/draft/${userId}`);
  }

  // 3. הוספה או עדכון של מתנה בסל (הזמנה)
  addOrUpdateGift(userId: number, giftId: number, amount: number): Observable<boolean> {
    const payload = { userId, giftId, amount };
    return this.http.post<boolean>(`${this.BASE_URL}/add-gift`, payload);
  }

  // 4. קבלת פרטי הזמנה ספציפית לפי ID כולל המתנות שבה
  getOrderById(orderId: number): Observable<OrderDTO> {
    return this.http.get<OrderDTO>(`${this.BASE_URL}/${orderId}`);
  }

  // 5. סגירת הזמנה (מעבר מ-Draft ל-Completed)
  completeOrder(orderId: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.BASE_URL}/complete/${orderId}`, {});
  }

  // 6. מחיקת מתנה מההזמנה
  deleteGiftFromOrder(orderId: number, giftId: number, amount: number): Observable<boolean> {
    // שליחת פרמטרים ב-Query String עבור ה-Delete
    let params = new HttpParams()
      .set('orderId', orderId.toString())
      .set('giftId', giftId.toString())
      .set('amount', amount.toString());

    return this.http.delete<boolean>(`${this.BASE_URL}/remove-gift`, { params });
  }
}