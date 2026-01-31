import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DtoLogin } from '../../models/UserDTO';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  userToLogin = new DtoLogin();
  message: string = '';

  onLogin() {
    this.authService.login(this.userToLogin).subscribe({
      next: (response) => {
        this.cartService.clearCart(); 
        console.log('Login successful!', response);
        this.message = 'התחברת בהצלחה!';
        setTimeout(() => this.router.navigate(['/home']), 1000);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.message = 'אופס... חלה שגיאה בהתחברות. נסה שוב.';
      }
    });
  }
}