import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Donor, DonorDto } from '../models/DonorDto';

@Injectable({
  providedIn: 'root'
})
export class DonorService {
  private apiUrl = '/api/Donor'; 
  constructor(private http: HttpClient) { }

  // שליחת אובייקטים מסוג ה-Class החדש
  getAllDonors(): Observable<Donor[]> {
    return this.http.get<Donor[]>(this.apiUrl).pipe(
      map(data => data.map(d => new Donor(d)))
    );
  }

  getDonorById(id: number): Observable<Donor> {
    return this.http.get<Donor>(`${this.apiUrl}/${id}`).pipe(
      map(d => new Donor(d))
    );
  }

  createDonor(donorDto: DonorDto): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, donorDto);
  }

  updateDonor(id: number, donorDto: DonorDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}`, donorDto);
  }

  deleteDonor(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  // חיפושים נוספים לפי Swagger
  getDonorsByName(name: string): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.apiUrl}/GetDonorByNameAsync/${name}`).pipe(
      map(data => data.map(d => new Donor(d)))
    );
  }

  getDonorsByEmail(email: string): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.apiUrl}/GetDonorByEmailAsync/${email}`).pipe(
      map(data => data.map(d => new Donor(d)))
    );
  }
}