import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private quantitiesSignal = signal<Record<number, number>>({});
  private cartItemsSignal = signal<any[]>([]);

  packageQuantities = this.quantitiesSignal.asReadonly();
  cartItems = this.cartItemsSignal.asReadonly();

  // חישוב מחיר אוטומטי שמתעדכן מיד בכל שינוי
  totalPrice = computed(() => {
    const items = this.cartItemsSignal();
    const quantities = this.quantitiesSignal();
    
    return items.reduce((acc, pkg) => {
      const qty = quantities[pkg.idPackage] || 0;
      const price = pkg.price || 0;
      return acc + (price * qty);
    }, 0);
  });

  // עדכון אופטימי: מעדכן גם כמות וגם מוסיף את האובייקט לסל מיד
  updatePackageInCart(pkg: any, qty: number) {
    this.quantitiesSignal.update(current => {
      const updated = { ...current };
      if (qty <= 0) delete updated[pkg.idPackage];
      else updated[pkg.idPackage] = qty;
      return updated;
    });

    this.cartItemsSignal.update(current => {
      const exists = current.find(item => item.idPackage === pkg.idPackage);
      if (!exists && qty > 0) return [...current, pkg];
      if (qty <= 0) return current.filter(item => item.idPackage !== pkg.idPackage);
      return current;
    });
  }

  setCartItems(items: any[]) {
    this.cartItemsSignal.set(items);
  }

  setAllQuantities(quantities: Record<number, number>) {
    this.quantitiesSignal.set(quantities);
  }

  // הפונקציה שחסרה לך וגורמת לשגיאה
  clearCart() {
    this.quantitiesSignal.set({});
    this.cartItemsSignal.set([]);
  }
}
