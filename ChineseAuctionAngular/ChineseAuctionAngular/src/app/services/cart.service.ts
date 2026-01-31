import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private quantitiesSignal = signal<Record<number, number>>({});
  private cartItemsSignal = signal<any[]>([]);

  packageQuantities = this.quantitiesSignal.asReadonly();
  cartItems = this.cartItemsSignal.asReadonly();

  clearCart() {
    this.quantitiesSignal.set({});
    this.cartItemsSignal.set([]);
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

  setAllQuantities(quantities: Record<number, number>) {
    this.quantitiesSignal.set(quantities);
  }
}