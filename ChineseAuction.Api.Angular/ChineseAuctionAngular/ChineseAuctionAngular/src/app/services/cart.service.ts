import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Package-related signals
  private quantitiesSignal = signal<Record<number, number>>({});
  private cartItemsSignal = signal<any[]>([]);

  packageQuantities = this.quantitiesSignal.asReadonly();
  cartItems = this.cartItemsSignal.asReadonly();

  // Gift-related signals
  private giftQuantitiesSignal = signal<Record<number, number>>({});
  private cartGiftsSignal = signal<any[]>([]);

  giftQuantities = this.giftQuantitiesSignal.asReadonly();
  cartGifts = this.cartGiftsSignal.asReadonly();

  // Available packages (full package definitions) to compute total tickets
  private availablePackagesSignal = signal<any[]>([]);
  availablePackages = this.availablePackagesSignal.asReadonly();


  totalPrice = computed(() => {
  const pkgs = this.availablePackagesSignal(); 
  const quantities = this.quantitiesSignal();  
  
  let total = 0;

  for (const idStr of Object.keys(quantities)) {
    const id = Number(idStr);
    const qty = quantities[id] || 0;
    const pkg = pkgs.find((p: any) => p.idPackage === id);
    
    if (pkg && pkg.price) {
      total += pkg.price * qty;
    }
  }
  return total;
});


  // Total tickets (cards) computed from available packages and package quantities
  totalTickets = computed(() => {
    const pkgs = this.availablePackagesSignal();
    const quantities = this.quantitiesSignal();
    let total = 0;
    for (const idStr of Object.keys(quantities)) {
      const id = Number(idStr);
      const qty = quantities[id] || 0;
      const pkg = pkgs.find((p: any) => p.idPackage === id);
      if (pkg) {
        const per = (pkg.amountRegular || 0) + (pkg.amountPremium || 0);
        total += per * qty;
      }
    }
    return total;
  });

  // Total gifts currently in cart (sum of gift quantities)
  totalGiftCount = computed(() => {
    const gQty = this.giftQuantitiesSignal();
    return Object.values(gQty).reduce((acc, v) => acc + (v || 0), 0);
  });

  // Ticket limit modal signals and message
  private ticketModalSignal = signal<boolean>(false);
  private ticketLimitMessageSignal = signal<string>('');

  ticketModal = this.ticketModalSignal.asReadonly();
  ticketMessage = this.ticketLimitMessageSignal.asReadonly();

  // Helper: can we add N more gifts given current ticket count?
  canAddGift(n: number = 1): boolean {
    const tickets = this.totalTickets();
    const gifts = this.totalGiftCount();
    if (!tickets || tickets <= 0) return false;
    return (gifts + n) <= tickets;
  }

  openTicketLimitModal(message: string) {
    this.ticketLimitMessageSignal.set(message);
    this.ticketModalSignal.set(true);
  }

  closeTicketLimitModal() {
    this.ticketModalSignal.set(false);
  }
setQuantity(packageId: number, qty: number) {
  this.quantitiesSignal.update(current => {
    const updated = { ...current };
    if (qty <= 0) {
      delete updated[packageId];
    } else {
      updated[packageId] = qty;
    }
    return updated;
  });
  


  this.enforceGiftLimit(); 
}

  setCartItems(items: any[]) {
    this.cartItemsSignal.set(items);
  }

  setAvailablePackages(items: any[]) {
    this.availablePackagesSignal.set(items);
  }
setAllQuantities(quantities: Record<number, number>) {
  this.quantitiesSignal.set(quantities);
  // אכיפה לאחר עדכון מאסיבי
  this.enforceGiftLimit();
}

private enforceGiftLimit() {
  // 1. קבלת כמות הכרטיסים המקסימלית המעודכנת (לפי החבילות שיש כרגע בסל)
  const allowed = this.totalTickets(); 
  
  // 2. יצירת עותק של כמויות המתנות הנוכחיות כדי לעדכן אותן
  const giftQtys = { ...this.giftQuantitiesSignal() }; 
  
  // 3. חישוב סך המתנות שיש כרגע בסל
  let currentTotal = Object.values(giftQtys).reduce((acc, v) => acc + (v || 0), 0);

  // 4. בדיקה: אם אנחנו כבר בטווח המותר, אין צורך לעשות כלום
  if (currentTotal <= allowed) return;

  // 5. יצירת עותק של רשימת המתנות כדי לעדכן את התצוגה
  const giftsList = [...this.cartGiftsSignal()];

  /**
   * 6. לולאת הסרה: עוברים על רשימת המתנות מהסוף להתחלה (LIFO).
   * ממשיכים כל עוד סך המתנות גבוה מהמכסה המותרת.
   */
  for (let i = giftsList.length - 1; i >= 0 && currentTotal > allowed; i--) {
    const g = giftsList[i];
    const id = g.idGift;
    const qty = giftQtys[id] || 0;
    
    if (qty <= 0) continue;

    // חישוב כמה "עודף" יש לנו מעבר למותר
    const excess = currentTotal - allowed;
    // מחליטים כמה להסיר: או את כל הכמות של המתנה הזו, או רק את מה שחורג
    const remove = Math.min(qty, excess);
    const newQty = qty - remove;
    
    // עדכון הספירה הכוללת להמשך הלולאה
    currentTotal -= remove;

    if (newQty > 0) {
      // אם נשארה כמות, מעדכנים אותה
      giftQtys[id] = newQty;
      giftsList[i] = { ...g, amount: newQty };
    } else {
      delete giftQtys[id];
      giftsList.splice(i, 1);
    }
  }

  this.giftQuantitiesSignal.set(giftQtys);
  this.cartGiftsSignal.set(giftsList);
}
  // Gift management methods
  setGiftQuantity(giftId: number, qty: number) {
    this.giftQuantitiesSignal.update(current => {
      const updated = { ...current };
      if (qty <= 0) {
        delete updated[giftId];
      } else {
        updated[giftId] = qty;
      }
      return updated;
    });
  }

  setCartGifts(gifts: any[]) {
    this.cartGiftsSignal.set(gifts);
  }

  setAllGiftQuantities(quantities: Record<number, number>) {
    this.giftQuantitiesSignal.set(quantities);
  }

  clearCart() {
    this.quantitiesSignal.set({});
    this.cartItemsSignal.set([]);
    this.giftQuantitiesSignal.set({});
    this.cartGiftsSignal.set([]);
  }
  
}
