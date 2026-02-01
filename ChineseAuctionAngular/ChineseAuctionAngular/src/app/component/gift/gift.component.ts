import { Component, OnInit, inject, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { GiftService } from '../../services/gift.service';
import { Gift } from '../../models/GiftDTO';

@Component({
  selector: 'app-gift',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gift.component.html',
  styleUrl: './gift.component.scss' // ודאי שהקובץ קיים, אפילו אם הוא ריק
})
export class GiftComponent implements OnInit {
  private giftService = inject(GiftService);
  
  // סיגנלים לניהול הנתונים
  gifts = signal<Gift[]>([]);
  selectedGift = signal<Gift | null>(null);

  ngOnInit(): void {
    this.loadGifts();
  }

  loadGifts(): void {
    this.giftService.getAllGifts().subscribe({
      next: (data) => {
        // מאתחל כל מתנה עם אובייקט חדש כדי להבטיח ש-customerQuantity קיים
        const initializedGifts = data.map(g => {
          const gift = new Gift(g);
          gift.customerQuantity = 0;
          return gift;
        });
        this.gifts.set(initializedGifts);
      },
      error: (err) => {
        console.error('שגיאה בטעינת הנתונים', err);
      }
    });
  }

  // פונקציות לניהול ה-Popup
  openDetails(gift: Gift): void {
    this.selectedGift.set(gift);
  }

  closeDetails(): void {
    this.selectedGift.set(null);
  }

  // פונקציות כמות
  increaseQuantity(gift: Gift): void {
    gift.customerQuantity = (gift.customerQuantity || 0) + 1;
  }

  decreaseQuantity(gift: Gift): void {
    if (gift.customerQuantity && gift.customerQuantity > 0) {
      gift.customerQuantity--;
    }
  }
}