import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DtoLogin, UserDTO } from '../models/UserDTO';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly BASE_URL = "/api/User";
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'auth_token';

  login = (details: DtoLogin) => this.http.post(`${this.BASE_URL}/login`, details, { responseType: 'text' }).pipe(tap(t => localStorage.setItem(this.TOKEN_KEY, t)));
  register = (userInfo: UserDTO) => this.http.post(`${this.BASE_URL}/register`, userInfo, { responseType: 'text' }).pipe(tap(t => localStorage.setItem(this.TOKEN_KEY, t)));
  logout = () => localStorage.removeItem(this.TOKEN_KEY);
  getToken = () => localStorage.getItem(this.TOKEN_KEY);

  public getUserId(): number {
    const token = this.getToken();
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // שליפה לפי המבנה שראינו ב-Console שלך
      const soapId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      return Number(soapId || 0);
    } catch { return 0; }
  }
}