import { Injectable , inject} from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { LoginRequestDto, LoginUserDto } from '../models/UserDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
 BASE_URL = 'https://localhost:7157/api/User';

 private http = inject(HttpClient);
 constructor(){}


login(data: LoginRequestDto): Observable<any> {
  return this.http.post(`${this.BASE_URL}/login`, data,{ responseType: 'text'});
}

register(userData: LoginUserDto): Observable<any> {
  return this.http.post(`${this.BASE_URL}/register`, userData,{ responseType: 'text'});
 }

}

