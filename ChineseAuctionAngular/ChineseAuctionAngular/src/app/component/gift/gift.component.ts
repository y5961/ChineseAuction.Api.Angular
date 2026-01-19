import { Component, OnInit, inject, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { GiftService } from '../../services/gift.service';
import { Gift } from '../../models/GiftDTO';

@Component({
  selector: 'app-gift',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gift.component.html',
  styleUrl: './gift.component.scss'
})
export class GiftComponent implements OnInit {
  private giftService = inject(GiftService);
  
  gifts = signal<Gift[]>([]);

  ngOnInit(): void {
    this.loadGifts();
  }

  loadGifts(): void {
    this.giftService.getAllGifts().subscribe({
      next: (data) => {
        this.gifts.set(data);
      },
      error: (err) => {
        console.error('שגיאה בטעינת הנתונים', err);
      }
    });
  }
}