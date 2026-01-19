import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddGiftRequest, OrderDto } from '../models/OrderDto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = '/api/Order'; // עדכן פורט בהתאם לשרת שלך

  constructor(private http: HttpClient) { }

  // GET /api/Order/user/{userId}
  getOrdersByUser(userId: number): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map(data => data.map(o => new OrderDto(o)))
    );
  }

  // GET /api/Order/GetByIdWithGiftsAsync/{orderId}
  getOrderByIdWithGifts(orderId: number): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.apiUrl}/GetByIdWithGiftsAsync/${orderId}`).pipe(
      map(o => new OrderDto(o))
    );
  }

  // POST /api/Order/add-gift
  addGiftToOrder(request: AddGiftRequest): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/add-gift`, request);
  }

  // DELETE /api/Order/remove-gift
  // שים לב: לפי הקוד השרת מצפה ל-orderId, giftId ו-amount
  removeGiftFromOrder(orderId: number, giftId: number, amount: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/remove-gift`, {
      params: { orderId: orderId.toString(), giftId: giftId.toString(), amount: amount.toString() }
    });
  }

  // POST /api/Order/complete/{orderId}
  completeOrder(orderId: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/complete/${orderId}`, {});
  }
}