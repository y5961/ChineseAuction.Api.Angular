import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';
import { DtoLogin } from '../../models/UserDTO';
import { ButtonModule } from 'primeng/button'; 
import { InputTextModule } from 'primeng/inputtext';
import { CartService } from '../../services/cart.service'; 
import { Router } from '@angular/router'; 
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, PasswordModule, CardModule,
    FormsModule, 
    InputTextModule, 
    ButtonModule, 
    RippleModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  userToRegister = new DtoLogin();
  message: string = '';

  onRegister() {
    this.authService.register(this.userToRegister).subscribe({
      next: (response) => {
        this.cartService.clearCart(); 
        console.log('Registration successful!', response);
        this.message = 'נרשמת בהצלחה למכירה הסינית!';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.message = 'אופס... חלה שגיאה ברישום. נסה שוב.';
      }
    });
  }
}