import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // חשוב עבור ngModel
import { AuthService } from '../../services/auth.service';
import { DtoLogin, UserDTO } from '../../models/UserDTO';
import { ButtonModule } from 'primeng/button'; // רכיבי PrimeNG
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  // 1. יצירת אובייקט ריק שמחובר לטופס
  userToRegister = new DtoLogin();
  
  // משתנה להצגת הודעות הצלחה/שגיאה במסך
  message: string = '';
  constructor(private authService: AuthService) {}

onRegister() {
    this.authService.register(this.userToRegister).subscribe({
      next: (response) => {
        console.log('Registration successful!', response);
        this.message = 'נרשמת בהצלחה למכירה הסינית!';
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.message = 'אופס... חלה שגיאה ברישום. נסה שוב.';
      }
    });
  }
}