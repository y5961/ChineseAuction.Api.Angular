import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private quantitiesSignal = signal<Record<number, number>>({});
  private cartItemsSignal = signal<any[]>([]);

  packageQuantities = this.quantitiesSignal.asReadonly();
  cartItems = this.cartItemsSignal.asReadonly();

  // לוגיקה חדשה: חישוב אוטומטי של המחיר הכולל בתוך השירות
  totalPrice = computed(() => {
    const items = this.cartItemsSignal();
    const quantities = this.quantitiesSignal();
    
    return items.reduce((acc, pkg) => {
      const qty = quantities[pkg.idPackage] || 0;
      const price = pkg.price || 0;
      return acc + (price * qty);
    }, 0);
  });

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

  setAllQuantities(quantities: Record<number, number>) {
    this.quantitiesSignal.set(quantities);
  }

  clearCart() {
    this.quantitiesSignal.set({});
    this.cartItemsSignal.set([]);
  }
}
