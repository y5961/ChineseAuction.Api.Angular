import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DtoLogin, UserDTO } from '../models/UserDTO';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly BASE_URL = "api/User";
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'auth_token'; // מפתח קבוע לשימוש ב-Storage

  constructor() { }

  // התחברות ושמירת התוקן
  login(details: DtoLogin): Observable<string> {
    return this.http.post(`${this.BASE_URL}/login`, details, { responseType: 'text' }).pipe(
      tap(token => this.saveToken(token))
    );
  }

  // רישום ושמירת התוקן
  register(userInfo: UserDTO): Observable<string> {
    return this.http.post(`${this.BASE_URL}/register`, userInfo, { responseType: 'text' }).pipe(
      tap(token => this.saveToken(token))
    );
  }

  // יציאה מהמערכת - ניקוי ה-LocalStorage
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // פונקציות עזר פנימיות
  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}