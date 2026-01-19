import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  redirectToPrizes() {
    console.log('מעבר לקטלוג הפרסים');
  }

  redirectToPackages() {
    console.log('מעבר לרכישת חבילות');
  }
}
