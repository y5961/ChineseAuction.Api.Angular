import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Donor, DonorDTO, DonorCreateDTO } from '../models/DonorDTO';
import { Gift } from '../models/GiftDTO';

@Injectable({
  providedIn: 'root'
})
export class DonorService {
  readonly BASE_URL = "api/Donors";
  private http = inject(HttpClient);

  constructor() {}

  // 1. קבלת כל התורמים
  getAllDonors(): Observable<DonorDTO[]> {
    return this.http.get<DonorDTO[]>(`${this.BASE_URL}`);
  }

  // 2. קבלת תורם לפי מזהה
  getDonorById(id: number): Observable<DonorDTO> {
    return this.http.get<DonorDTO>(`${this.BASE_URL}/${id}`);
  }

  // 3. יצירת תורם חדש
  createDonor(dto: DonorCreateDTO): Observable<number> {
    return this.http.post<number>(`${this.BASE_URL}`, dto);
  }

  // 4. עדכון פרטי תורם
  updateDonor(id: number, dto: DonorCreateDTO): Observable<void> {
    return this.http.put<void>(`${this.BASE_URL}/${id}`, dto);
  }

  // 5. מחיקת תורם
  deleteDonor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // 6. קבלת מתנות של תורם ספציפי
getGiftsByDonorId(donorName: string): Observable<Gift[]> { 
  return this.http.get<Gift[]>(`api/Gift/sort/donor/${donorName}`);
}

  // 7. חיפוש/מיון לפי שם
  sortByName(name: string): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.BASE_URL}/sort/name?name=${name}`);
  }

  // 8. חיפוש/מיון לפי אימייל
  sortByEmail(email: string): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.BASE_URL}/sort/email?email=${email}`);
  }

  // 9. חיפוש לפי מתנה
  sortByGift(giftName: string): Observable<Donor> {
    return this.http.get<Donor>(`${this.BASE_URL}/sort/gift?gift=${giftName}`);
  }
}