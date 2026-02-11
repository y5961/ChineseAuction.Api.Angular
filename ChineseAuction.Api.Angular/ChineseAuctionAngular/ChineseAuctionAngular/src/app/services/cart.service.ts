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
  }

  setCartItems(items: any[]) {
    this.cartItemsSignal.set(items);
  }

  setAvailablePackages(items: any[]) {
    this.availablePackagesSignal.set(items);
  }

  setAllQuantities(quantities: Record<number, number>) {
    this.quantitiesSignal.set(quantities);
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
