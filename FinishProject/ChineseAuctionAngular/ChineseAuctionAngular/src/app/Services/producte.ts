import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gift, GiftDto, GiftDtoNew } from '../models/GiftDto';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  private readonly BASE_URL = 'https://localhost:7157/api/Gift';
  private http = inject(HttpClient);

  constructor() {}

  // שליפת כל המתנות
  getAllGifts(): Observable<Gift[]> {
    return this.http.get<Gift[]>(this.BASE_URL);
  }

  // הוספת מתנה חדשה
  addGift(gift: GiftDto): Observable<Gift> {
    return this.http.post<Gift>(this.BASE_URL, gift);
  }

  // שליפת מתנה לפי ID
  getGiftById(id: number): Observable<Gift> {
    return this.http.get<Gift>(`${this.BASE_URL}/${id}`);
  }

  // מחיקת מתנה
  deleteGift(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.BASE_URL}/${id}`);
  }

  // חיפוש מתנה לפי שם
  getGiftsByName(name: string): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}/search/gift/${name}`);
  }

  // חיפוש מתנות לפי שם תורם
  getGiftsByDonorName(donorName: string): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}/search/donor/${donorName}`);
  }

  // שליפת מתנות עם מספר רוכשים מינימלי
  getGiftsByMinBuyers(num: number): Observable<GiftDtoNew[]> {
    return this.http.get<GiftDtoNew[]>(`${this.BASE_URL}/buyers/${num}`);
  }

  // מיון מתנות לפי מחיר (מהיקר לזול)
  sortGiftsByPrice(): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}/sort/price`);
  }

  // מיון מתנות לפי כמות כרטיסים/אנשים שקנו
  sortGiftsByPopularity(): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}/sort/popularity`);
  }

  // הרצת הגרלה למתנה ספציפית
  drawWinner(giftId: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/draw/${giftId}`, {});
  }
}