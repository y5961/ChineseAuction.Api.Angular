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
    identity: '',
    first_Name: '',
    last_Name: '', 
    email: '',
    phonNumber: '', 
    city: '', 
    address: '', 
    password: ''
  };

  onRegister() {
    this.authService.register(this.newUser).subscribe({
      next: (res) => {
        alert('הרישום הצליח! ברוכים הבאים למשפחה.');
        console.log('User joined:', res);
      },
      error: (err) => console.error('Connection failed. Port 7157 checked?', err)
    });
  }
}
