import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftService } from '../../Services/producte';

@Component({
  selector: 'app-gifts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gifts.html',
  styleUrl: './gifts.scss'
})
export class Gifts implements OnInit {
  gifts = signal<any[]>([]); 
  private giftService = inject(GiftService);

  ngOnInit() {
    console.log(' Gifts component loaded');
    this.loadGifts();
  }

  loadGifts() {
    this.giftService.getAllGifts().subscribe({
      next: (res: any[]) => {
        console.log(' Formatted gifts:', res);
        this.gifts.set(res);
      },
      error: (err) => {
        console.error('Error details:', err.error || err.message);
      }
    });
  }
}