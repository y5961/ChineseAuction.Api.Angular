import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  cartPackages = this.cartService.cartItems;
  packageQuantities = this.cartService.packageQuantities;

  constructor() {
    effect(() => {
      const userId = this.authService.getUserId();
      if (userId > 0) {
        this.loadCart();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    const userId = this.authService.getUserId();
    if (userId > 0) {
      this.orderService.getUserOrders(userId).subscribe({
        next: (res: any) => {
          const draft = res.orders?.find((o: any) => o.status === 0);
          if (draft) {
            const qtys: Record<number, number> = {};
            draft.ordersPackages.forEach((p: any) => {
              qtys[p.idPackage] = p.quantity;
            });
            this.cartService.setAllQuantities(qtys);
            this.cartService.setCartItems(draft.ordersPackages);
          } else {
            this.cartService.setCartItems([]);
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
    if (current > 0) this.updateQty(id, current - 1);
  }

  private updateQty(idPackage: number, newQty: number) {
    const userId = this.authService.getUserId();
    this.orderService.updatePackageQuantity(userId, idPackage, newQty).subscribe(() => {
      this.cartService.setQuantity(idPackage, newQty);
      if (newQty === 0) {
        this.loadCart();
      }
    });
  }
}