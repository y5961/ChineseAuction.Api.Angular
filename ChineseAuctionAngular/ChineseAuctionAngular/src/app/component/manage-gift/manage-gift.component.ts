import { Component, OnInit, inject, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { GiftService } from '../../services/gift.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Gift } from '../../models/GiftDTO';
import { environment } from '../../../../enviroment';
import { Router , RouterLink} from '@angular/router';
@Component({
  selector: 'app-manage-gift',
  imports: [CommonModule, RouterLink],
  templateUrl: './manage-gift.component.html',
  styleUrl: './manage-gift.component.scss'
})
export class ManageGiftComponent {
imageUrl = environment.apiUrl + '/images/gift/';  
  private router = inject(Router);
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

  openDetails(gift: Gift): void {
    this.selectedGift.set(gift);
  }

  closeDetails(): void {
    this.selectedGift.set(null);
  }
onTabChange(event: any) {
}
 delete(gift: Gift): void {
  if (confirm(`האם אתה בטוח שברצונך למחוק את "${gift.name}"?`)) {
    this.giftService.deleteGift(gift.idGift).subscribe({ 
      next: () => {
        this.gifts.set(this.gifts().filter(g => g.idGift !== gift.idGift));
        this.closeDetails();
      },
      error: (err: any) => {
        console.error('שגיאה במחיקה', err);
      }
    });
  }
}

edit(gift: Gift): void {
    console.log('עורך את מתנה:', gift.idGift);
    this.router.navigate(['/task-manager/edit-gift', gift.idGift]);
  }

}
