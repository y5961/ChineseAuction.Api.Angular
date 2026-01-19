import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // חשוב עבור ngModel
import { AuthService } from '../../services/auth.service';
import { DtoLogin, UserDTO } from '../../models/UserDTO';
import { ButtonModule } from 'primeng/button'; // רכיבי PrimeNG
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userToLogin = new DtoLogin();
  
  // משתנה להצגת הודעות הצלחה/שגיאה במסך
  message: string = '';
  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.userToLogin).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        
        this.message = 'התחברת בהצלחה!';
      },
      error: (err) => {
        console.error('Login error:', err);
        this.message = 'אופס... חלה שגיאה בהתחברות. נסה שוב.';
      }
    });
  }

}


