import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gift, GiftDTO, GiftNewDTO } from '../models/GiftDTO';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class GiftService {
  readonly BASE_URL="api/Gift";
 private http =inject(HttpClient);

  constructor() {}
    // 1. יצירת מתנה חדשה
  createGift(dto: GiftDTO): Observable<Gift> {
    return this.http.post<Gift>(`${this.BASE_URL}`, dto);
  }

  // 2. מחיקת מתנה
  deleteGift(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.BASE_URL}/${id}`);
  }

  // 3. קבלת כל המתנות
  getAllGifts(): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}`);
  }

  // 4. קבלת מתנה לפי ID
  getGiftById(id: number): Observable<Gift> {
    return this.http.get<Gift>(`${this.BASE_URL}/${id}`);
  }

  // 5. הגרלת זוכה למתנה
  drawWinnerForGift(giftId: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/draw/${giftId}`, {});
  }

  // 6. חיפוש מתנה לפי שם
  getByNameGift(word: string): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}/search/gift?word=${word}`);
  }

  // 7. חיפוש לפי שם תורם
  getByNameDonor(donor: string): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}/search/donor?donor=${donor}`);
  }

  // 8. קבלת מתנות לפי מספר רוכשים
  getByNumOfBuyers(buyers: number): Observable<GiftNewDTO[]> {
    return this.http.get<GiftNewDTO[]>(`${this.BASE_URL}/buyers/${buyers}`);
  }

  // 9. מיון לפי מחיר
  sortByPrice(): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}/sort/price`);
  }

  // 10. מיון לפי כמות אנשים (פופולריות)
  sortByAmountPeople(): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.BASE_URL}/sort/popularity`);
  }

   }

