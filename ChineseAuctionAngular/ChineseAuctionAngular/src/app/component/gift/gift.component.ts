import { Component, OnInit, inject, signal, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { GiftService } from '../../services/gift.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Gift } from '../../models/GiftDTO';
import { environment } from '../../../../environment';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  private cartService = inject(CartService);
  private router = inject(Router);
  
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

  // (ticket modal displayed via CartService)
  
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
    // Determine current server/cart quantity (fallback to local) and increment
    const currentQty = this.cartService.giftQuantities()[gift.idGift] || gift.customerQuantity || 0;
    if (!this.cartService.canAddGift(1)) {
      const tickets = this.cartService.totalTickets();
      const used = this.cartService.totalGiftCount();
      const missing = Math.max(0, (used + 1) - tickets);
      const msg = tickets === 0 ? 'אין לך כרטיסים בסל — יש לרכוש חבילות כרטיסים.' : `אין מספיק כרטיסים. חסרים ${missing} כרטיסים.`;
      this.cartService.openTicketLimitModal(msg);
      return;
    }

    const userId = this.authService.getUserId();
    const newQty = currentQty + 1;
    this.orderService.addOrUpdateGiftInOrder(userId, gift.idGift, newQty).subscribe({
      next: () => {
        gift.customerQuantity = newQty;
        this.gifts.set([...this.gifts()]);
        // merge into cartService list: set absolute quantity returned/newQty
        const currentCart = [...this.cartService.cartGifts()];
        const idx = currentCart.findIndex(c => c.idGift === gift.idGift);
        if (idx >= 0) {
          const existing = currentCart[idx];
          currentCart[idx] = {
            ...existing,
            amount: newQty
          };
        } else {
          currentCart.push({
            idGift: gift.idGift,
            name: gift.name,
            price: gift.price,
            amount: newQty,
            image: gift.image,
            category: gift.category?.name || ''
          });
        }
        this.cartService.setCartGifts(currentCart);
        this.cartService.setGiftQuantity(gift.idGift, newQty);
      },
      error: (err) => {
        try {
          const status = err?.status;
          const code = err?.error?.code || err?.error;
          if (status === 400 && (code === 'INSUFFICIENT_TICKETS' || (typeof code === 'string' && code.includes('INSUFFICIENT_TICKETS')))) {
            const tickets = this.cartService.totalTickets();
            const used = this.cartService.totalGiftCount();
            const missing = Math.max(0, (used + 1) - tickets);
            const msg = tickets === 0 ? 'אין לך כרטיסים בסל — יש לרכוש חבילות כרטיסים.' : `אין מספיק כרטיסים. חסרים ${missing} כרטיסים.`;
            this.cartService.openTicketLimitModal(msg);
            return;
          }
        } catch (e) {
          // ignore
        }
        console.error('Error adding gift', err);
      }
    });
  }

  closeLimitModal() {
    this.cartService.closeTicketLimitModal();
  }

  goToPackages() {
    this.cartService.closeTicketLimitModal();
    this.router.navigate(['/package']);
  }

  decreaseQuantity(gift: Gift): void {
    // Determine current quantity from cart (fallback to local)
    const currentQty = this.cartService.giftQuantities()[gift.idGift] || gift.customerQuantity || 0;
    if (currentQty <= 0) return;
    const userId = this.authService.getUserId();
    const newQty = currentQty - 1;
    this.orderService.addOrUpdateGiftInOrder(userId, gift.idGift, newQty).subscribe({
      next: () => {
        gift.customerQuantity = newQty;
        this.gifts.set([...this.gifts()]);
        // merge update into cart: set absolute quantity
        const currentCart = [...this.cartService.cartGifts()];
        const idx = currentCart.findIndex(c => c.idGift === gift.idGift);
        if (idx >= 0) {
          if (newQty > 0) {
            currentCart[idx] = { ...currentCart[idx], amount: newQty };
          } else {
            currentCart.splice(idx, 1);
          }
        } else if (newQty > 0) {
          currentCart.push({
            idGift: gift.idGift,
            name: gift.name,
            price: gift.price,
            amount: newQty,
            image: gift.image,
            category: gift.category?.name || ''
          });
        }
        this.cartService.setCartGifts(currentCart);
        this.cartService.setGiftQuantity(gift.idGift, newQty);
      }
    });
  }

  // (old helper removed) merging is done inline when quantities change to avoid overwriting existing cart

  openDetails(gift: Gift): void { this.selectedGift.set(gift); }
  closeDetails(): void { this.selectedGift.set(null); }
}