import { Component, OnInit, inject, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { GiftService } from '../../services/gift.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
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
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  
  gifts = signal<Gift[]>([]);
  selectedGift = signal<Gift | null>(null);
  showNoTicketsModal = signal<boolean>(false);

  ngOnInit(): void {
    this.loadGifts();
  }

  loadGifts(): void {
    this.giftService.getAllGifts().subscribe({
      next: (data) => {
        const initializedGifts = data.map(g => {
          const gift = new Gift(g);
          gift.customerQuantity = 0;
          return gift;
        });
        this.gifts.set(initializedGifts);
      },
      error: (err: any) => {
        console.error('שגיאה בטעינת הנתונים', err);
      }
    });
  }

  // פונקציות לפתיחה וסגירה של המודל
  openDetails(gift: Gift): void {
    this.selectedGift.set(gift);
  }

  closeDetails(): void {
    this.selectedGift.set(null);
  }

  // פונקציה להעלאת כמות (פלוס)
  increaseQuantity(gift: Gift): void {
    const userId = this.authService.getUserId();
    const newQty = (gift.customerQuantity || 0) + 1;

    this.orderService.addOrUpdateGiftInOrder(userId, gift.idGift, newQty).subscribe({
      next: () => {
        gift.customerQuantity = newQty;
        // עדכון הסיגנל כדי שה-UI יתרענן
        this.gifts.set([...this.gifts()]);
      },
      error: (err: any) => {
        if (err.status === 400) {
          this.showNoTicketsModal.set(true);
        }
      }
    });
  }

  // פונקציה להורדת כמות (מינוס)
  decreaseQuantity(gift: Gift): void {
    if (!gift.customerQuantity || gift.customerQuantity <= 0) return;

    const userId = this.authService.getUserId();
    const newQty = gift.customerQuantity - 1;

    this.orderService.addOrUpdateGiftInOrder(userId, gift.idGift, newQty).subscribe({
      next: () => {
        gift.customerQuantity = newQty;
        this.gifts.set([...this.gifts()]);
      }
    });
  }
}