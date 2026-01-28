import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  cartPackages = signal<any[]>([]); 
  packageQuantities = signal<{ [key: number]: number }>({});
  userId: number = 0;

  ngOnInit() {
    this.userId = this.authService.getUserId(); 
    if (this.userId > 0) {
      this.loadCart();
    }
  }
// src/app/component/cart/cart.component.ts
loadCart() {
  this.orderService.getUserOrders(this.userId).subscribe({
    next: (userResponse: any) => {
      const orders = userResponse.orders || [];
      const draft = orders.find((o: any) => o.status === 0);
      
      if (draft && draft.ordersPackages) {
        const qtys: { [key: number]: number } = {};
        
        draft.ordersPackages.forEach((p: any) => {
          // שימי לב: השמות חייבים להתאים ל-DTO מה-C#
          // אם ב-C# כתבת IdPackage ו-Quantity, השתמשי בהם כאן:
          const id = p.idPackage || p.IdPackage; 
          const qty = p.quantity !== undefined ? p.quantity : p.Quantity;
          
          if (id) {
            qtys[id] = qty;
          }
        });

        this.packageQuantities.set(qtys);
        this.cartPackages.set([...draft.ordersPackages]); 
      }
    },
    error: (err) => console.error('Error:', err)
  });
}
  increment(idPackage: number) {
    const currentQty = this.packageQuantities()[idPackage] || 0;
    this.updateQty(idPackage, currentQty + 1);
  }

  decrement(idPackage: number) {
    const currentQty = this.packageQuantities()[idPackage] || 0;
    if (currentQty > 0) this.updateQty(idPackage, currentQty - 1);
  }

  private updateQty(idPackage: number, newQty: number) {
    this.orderService.updatePackageQuantity(this.userId, idPackage, newQty).subscribe({
      next: () => {
        // עדכון מקומי של ה-Signal כדי שהתצוגה תשתנה מיד
        console.log(this.packageQuantities())
        this.packageQuantities.update(q => ({ ...q, [idPackage]: newQty }));
      },
      error: (err) => console.error('Update failed:', err)
    });
  }
  
}