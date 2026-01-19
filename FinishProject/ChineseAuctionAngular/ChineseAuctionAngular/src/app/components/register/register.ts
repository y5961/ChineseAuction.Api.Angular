import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LoginUserDto } from '../../models/UserDto';
import { Auth } from '../../Services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, FloatLabelModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private authService = inject(Auth);

  newUser: LoginUserDto = {
    Identity: '',   
    First_Name: '',  
    Last_Name: '',   
    Email: '',       
    PhonNumber: '',  
    City: '', 
    Address: '', 
    password: ''     
  };
  
  onRegister() {    
    console.log('🔵 Register attempt:', this.newUser);

    if (!this.newUser.Identity || this.newUser.Identity.length !== 9) {
      alert('תעודת זהות חייבת להכיל 9 ספרות בדיוק');
      return;
    }

    if (!this.newUser.First_Name || this.newUser.First_Name.trim() === '') {
      alert('שם פרטי הוא חובה');
      return;
    }

    if (!this.newUser.Last_Name || this.newUser.Last_Name.trim() === '') {
      alert('שם משפחה הוא חובה');
      return;
    }

    if (!this.newUser.Email || !this.newUser.Email.includes('@')) {
      alert('כתובת אימייל תקינה היא חובה');
      return;
    }

    if (!this.newUser.password || this.newUser.password.length < 6) {
      alert('סיסמה חייבת להיות לפחות 6 תווים');
      return;
    }

    if (!this.newUser.PhonNumber || this.newUser.PhonNumber.length < 9) {
      alert('מספר טלפון תקין הוא חובה');
      return;
    }

    const dataToSend = {
      Identity: this.newUser.Identity,
      First_Name: this.newUser.First_Name,
      Last_Name: this.newUser.Last_Name,
      Email: this.newUser.Email,
      PhonNumber: this.newUser.PhonNumber, 
      City: this.newUser.City,
      Address: this.newUser.Address,
      password: this.newUser.password
    };

    console.log(' Sending registration data:', dataToSend);

    this.authService.register(dataToSend as any).subscribe({
      next: (res) => {
        alert('הרישום הצליח! ברוכים הבאים למשפחה.');
      },
      error: (err) => {
        alert('הרישום נכשל. בדוק את פרטי השדות');
      }
    });
}
}