import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { DtoLogin, UserDTO } from '../models/UserDTO';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly BASE_URL="https://localhost:7273/api/User";
  private http =inject(HttpClient);

  constructor() { }
  login(details:DtoLogin):Observable<string>{
    return this.http.post(`${this.BASE_URL}/login`,details,{responseType:'text'});
  }
  register(userInfo:UserDTO):Observable<string>{
    return this.http.post(`${this.BASE_URL}/register`,userInfo,{responseType:'text'});
  }

}
