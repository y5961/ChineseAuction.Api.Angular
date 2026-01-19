import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { LoginRequestDto, LoginUserDto } from '../models/UserDto';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  BASE_URL = '/api/User'; 
  private http = inject(HttpClient);

  login(data: LoginRequestDto): Observable<any> {
    const url = `${this.BASE_URL}/login`;
    return this.http.post(url, data, { responseType: 'text' as 'json' }).pipe(
      tap((res: any) => localStorage.setItem('token', res))
    );
  }

  register(userData: LoginUserDto): Observable<any> {
    const url = `${this.BASE_URL}/register`;
    return this.http.post(url, userData).pipe(
      tap((res: any) => {
        if (res && res.token) localStorage.setItem('token', res.token);
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}