import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LoginRequestDto, LoginUserDto } from '../../models/UserDto';
import { Auth } from '../../Services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, FloatLabelModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
 private authService = inject(Auth);

  loginData: LoginRequestDto = {
    Email: '',       
    password: ''     
  };

 onLogin() {    
  const payload = {
    Email: this.loginData.Email,
    password: this.loginData.password 
  };


  if (!payload.Email || !payload.Email.includes('@')) {
    alert('אנא הזן כתובת אימייל תקינה');
    return;
  }

  this.authService.login(payload).subscribe({
    next: (res) => {
      alert('הכניסה הצליחה! ברוכים הבאים.');
      console.log('Server Response:', res);
    },
    error: (err) => {
      console.error(' Login failed:', err);
      
 
    }
  });
}
}

