import { Component, OnInit, inject, signal, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { GiftService } from '../../services/gift.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Gift } from '../../models/GiftDTO';
import { environment } from '../../../../environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gift',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gift.component.html',
  styleUrl: './gift.component.scss'
})
export class GiftComponent implements OnInit {
  imageUrl = environment.apiUrl + '/images/gift/';
  private giftService = inject(GiftService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  
  gifts = signal<Gift[]>([]);
  selectedGift = signal<Gift | null>(null);
  
  // סיגנלים לסינון (לשימוש מקומי או שליחה לשרת)
  categoryFilter = signal<string>('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  searchWord = signal<string>('');

  ngOnInit(): void {
    this.loadGifts();
  }

  // טעינה ראשונית של כל המתנות
  loadGifts(): void {
    this.giftService.getAllGifts().subscribe({
      next: (data) => this.initializeGifts(data),
      error: (err) => console.error('Error loading gifts', err)
    });
  }

  // פונקציית עזר לאתחול הנתונים שחוזרים מה-Service
  private initializeGifts(data: any[]): void {
    const initializedGifts = data.map(g => {
      const gift = new Gift(g);
      gift.customerQuantity = 0; // אתחול כמות בעגלה
      return gift;
    });
    this.gifts.set(initializedGifts);
  }

  // --- שימוש בפונקציות המיון והסינון מה-Service ---

  // מיון לפי מחיר מהשרת
  onSortByPrice(): void {
    this.giftService.sortByPrice().subscribe({
      next: (data) => this.initializeGifts(data)
    });
  }

  // מיון לפי פופולריות מהשרת
  onSortByPopularity(): void {
    this.giftService.sortByAmountPeople().subscribe({
      next: (data) => this.initializeGifts(data)
    });
  }

  // חיפוש לפי מילה מהשרת
  onSearchChange(event: Event): void {
    const word = (event.target as HTMLInputElement).value;
    this.searchWord.set(word);
    
    if (word.length > 1) {
      this.giftService.getByNameGift(word).subscribe({
        next: (data) => this.initializeGifts(data)
      });
    } else if (word.length === 0) {
      this.loadGifts();
    }
  }

  filterByNumOfBuyers(buyers: number): void {
    this.giftService.getByNumOfBuyers(buyers).subscribe({
      next: (data) => {
        const mapped = data.map(g => new Gift(g));
        this.gifts.set(mapped);
      }
    });
  }
  filteredGifts = computed(() => {
    return this.gifts().filter(gift => {
      const matchCategory = !this.categoryFilter() || gift.category?.name === this.categoryFilter();
      const min = this.minPrice() ?? 0;
      const max = this.maxPrice() ?? Infinity;
      const matchPrice = gift.price >= min && gift.price <= max;
      
      return matchCategory && matchPrice;
    });
  });
  
  categories = computed(() => {
    const names = this.gifts().map(g => g.category?.name).filter(Boolean);
    return Array.from(new Set(names));
  });

  updateCategory(event: Event) {
    this.categoryFilter.set((event.target as HTMLSelectElement).value);
  }

  updateMinPrice(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.minPrice.set(val ? parseFloat(val) : null);
  }

  updateMaxPrice(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.maxPrice.set(val ? parseFloat(val) : null);
  }

  // --- ניהול עגלה ---

  increaseQuantity(gift: Gift): void {
    const userId = this.authService.getUserId();
    const newQty = (gift.customerQuantity || 0) + 1;
    this.orderService.addOrUpdateGiftInOrder(userId, gift.idGift, newQty).subscribe({
      next: () => {
        gift.customerQuantity = newQty;
        this.gifts.set([...this.gifts()]);
      }
    });
  }

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

  openDetails(gift: Gift): void { this.selectedGift.set(gift); }
  closeDetails(): void { this.selectedGift.set(null); }
}