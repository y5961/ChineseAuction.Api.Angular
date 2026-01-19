import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFound {
  private router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}