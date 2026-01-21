import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service'; // וודאי נתיב תקין
import { PackageDTO } from '../../models/PackageDTO';
import { BadgeModule } from 'primeng/badge';
import { ContextMenuModule, ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, BadgeModule, ContextMenuModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private orderService = inject(OrderService);
  
  @ViewChild('cm') cm!: ContextMenu;

  // מזהה המשתמש - בדרך כלל יגיע משירות Auth
  userId = 1; 
  
  // ניהול כמויות בעזרת Signal לממשק מהיר
  packageQuantities = signal<{ [key: number]: number }>({});
  
  // רשימת החבילות שנציג בעגלה
  cartPackages: PackageDTO[] = [];
  
  items: MenuItem[] = [
    { label: 'מחק מהסל', icon: 'pi pi-trash', command: () => console.log('Delete logic here') }
  ];

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.orderService.getDraftOrder(this.userId).subscribe({
      next: (order) => {
        if (order && order.ordersGifts) {
          const quantities: { [key: number]: number } = {};
          
          // מיפוי הנתונים מהשרת לתוך ה-Signal והרשימה
          // order.ordersPackages.forEach(pkg => {
          //   quantities[pkg.idPackage] = pkg.quantity;
          //   if (pkg.package) {
          //     this.cartPackages.push(pkg.package);
          //   }
          // });
          
          this.packageQuantities.set(quantities);
        }
      }
    });
  }

  // פונקציית הגדלת כמות
  increment(packageId: number): void {
    const currentQty = this.packageQuantities()[packageId] || 0;
    const newQty = currentQty + 1;
    this.updateQuantity(packageId, newQty);
  }

  // פונקציית הפחתת כמות
  decrement(packageId: number): void {
    const currentQty = this.packageQuantities()[packageId] || 0;
    if (currentQty <= 0) return;

    const newQty = currentQty - 1;
    this.updateQuantity(packageId, newQty);
  }

  private updateQuantity(packageId: number, newQty: number) {
    // עדכון אופטימי (מיידי בממשק)
    const previousQty = this.packageQuantities()[packageId];
    this.packageQuantities.update(q => ({ ...q, [packageId]: newQty }));

    // עדכון ב-API
    this.orderService.addOrUpdateGift(this.userId, packageId, newQty).subscribe({
      next: (success) => {
        if (!success) this.rollback(packageId, previousQty);
      },
      error: () => this.rollback(packageId, previousQty)
    });
  }

  private rollback(id: number, qty: number) {
    this.packageQuantities.update(q => ({ ...q, [id]: qty }));
  }

  onContextMenu(event: MouseEvent) {
    this.cm.show(event);
    event.preventDefault();
  }
}
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-cart',
//   imports: [],
//   templateUrl: './cart.component.html',
//   styleUrl: './cart.component.scss'
// })
// export class CartComponent {

// }
