import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DtoLogin, UserDTO } from '../models/UserDTO';
import { tap } from 'rxjs';
import { CartService } from './cart.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly BASE_URL = "/api/User";
  private http = inject(HttpClient);
  private router = inject(Router);
  private cartService = inject(CartService);
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly MANAGER_KEY = 'is_manager'; 
  isLoggedIn = signal<boolean>(!!localStorage.getItem('auth_token'));

  isManager = signal<boolean>(localStorage.getItem(this.MANAGER_KEY) === 'true');
  currentUserId = signal<number>(0);  

  constructor() {
  this.currentUserId.set(this.getUserIdFromToken());
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  private checkAdminFromToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return role === 'Admin' || role === 'Manager' || payload['IsManager'] === true;
    } catch {
      return false;
    }
  }
login(details: DtoLogin) {
  return this.http.post(`${this.BASE_URL}/login`, details, { responseType: 'text' }).pipe(
    tap(token => {
      localStorage.setItem(this.TOKEN_KEY, token);
      
      const isAdmin = this.checkAdminFromToken(token);
      localStorage.setItem('is_manager', String(isAdmin));
      
      this.isLoggedIn.set(true);
      this.isManager.set(isAdmin);
      this.currentUserId.set(this.getUserIdFromToken());
    })
  );
}

  register(userInfo: UserDTO) {
    return this.http.post(`${this.BASE_URL}/register`, userInfo, { responseType: 'text' }).pipe(
      tap(token => {
        localStorage.setItem(this.TOKEN_KEY, token);
        this.isLoggedIn.set(true);
        this.currentUserId.set(this.getUserIdFromToken());
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false); // מחזיר את ה-Header למצב "כניסה/הרשמה"
    this.currentUserId.set(0);
    this.cartService.clearCart();
    this.router.navigate(['/login']);
  }


  private getUserIdFromToken(): number {
  const token = this.getToken();
  if (!token) return 0;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const isAdmin = role === 'Manager' || role === 'Admin';
    
    this.isManager.set(isAdmin);
    localStorage.setItem('is_manager', String(isAdmin));

    const soapId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    return Number(soapId || 0);
  } catch {
    return 0;
  }
}

  public getUserId(): number {
    return this.currentUserId();
  }
}


