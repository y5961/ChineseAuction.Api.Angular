import { Component, OnInit, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { PackageService } from '../../services/package.service';
import { environment } from '../../../../environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  imageUrl = environment.apiUrl + '/images/packages/';
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private packageService = inject(PackageService);

  cartPackages = this.cartService.cartItems;
  packageQuantities = this.cartService.packageQuantities;
  allAvailablePackages = signal<any[]>([]);

  constructor() {}

ngOnInit() {
  // טעינת חבילות ורק אז טעינת הסל כדי להבטיח שהנתונים זמינים להצלבה
  this.packageService.getAllPackages().subscribe((pkgs: any[]) => {
    this.allAvailablePackages.set(pkgs);
    
    const userId = this.authService.getUserId();
    if (userId > 0) {
      this.loadCart();
    }
  });
}

  loadCart() {
  const userId = this.authService.getUserId();
  if (userId > 0) {
    this.orderService.getUserOrders(userId).subscribe({
      next: (res: any) => {
        const draft = res.orders?.find((o: any) => o.status === 0);
        if (draft && draft.ordersPackages) {
          const qtys: Record<number, number> = {};
          
          const enrichedPackages = draft.ordersPackages.map((item: any) => {
            const fullInfo = this.allAvailablePackages().find(p => p.idPackage === item.idPackage);
            qtys[item.idPackage] = item.quantity; // עדכון הכמות במיפוי
            return {
              ...item,
              price: fullInfo?.price || item.price || 0 // וודא שהמחיר מגיע מהחבילה המקורית
            };
          });

          // עדכון ה-Signals
          this.cartService.setAllQuantities(qtys);
          this.cartService.setCartItems(enrichedPackages);
          
          // רק עכשיו נקרא לחישוב מחדש
          this.calculateTotal(); 
        }
      }
    });
  }
}



  increment(id: number) {
    this.updateQty(id, (this.packageQuantities()[id] || 0) + 1);
  }

  decrement(id: number) {
    const current = this.packageQuantities()[id] || 0;
    if (current > 0) {
      this.updateQty(id, current - 1);
    }
  }

  private updateQty(idPackage: number, newQty: number) {
    const userId = this.authService.getUserId();
    this.orderService.updatePackageQuantity(userId, idPackage, newQty).subscribe({
      next: () => {
        this.cartService.setQuantity(idPackage, newQty);
        if (newQty === 0) {
          this.loadCart();
        }
      },
      error: (err) => console.error('Error updating quantity', err)
    });
  }

  getPackageImage(id: number): string {
    const images = ['p-green.png', 'p-blue.png', 'p-pink.png', 'p-red.png'];
    return images[id % images.length];
  }

  calculateTotal(): number {
    return this.cartPackages().reduce((acc, pkg) => {
      const qty = this.packageQuantities()[pkg.idPackage] || 0;
      const price = pkg.price || 0;
      return acc + (price * qty);
    }, 0);
  }
}