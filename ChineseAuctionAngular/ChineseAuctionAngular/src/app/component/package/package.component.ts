import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { PackageDTO } from '../../models/PackageDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-package',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package.component.html', // ודאי שכתוב כאן package ולא cart!
  styleUrl: './package.component.scss'
})
export class PackageComponent implements OnInit { // ודאי שיש כאן export
  private packageService = inject(PackageService);
  private orderService = inject(OrderService);
  public authService = inject(AuthService);
  private router = inject(Router);

  packages = signal<PackageDTO[]>([]);
  packageQuantities = signal<{ [key: number]: number }>({});

ngOnInit() {
  // 1. טעינת כל החבילות לתצוגה
  this.packageService.getAllPackages().subscribe(data => this.packages.set(data));

  // 2. טעינת הכמויות הקיימות מהשרת כדי שהן יופיעו בריענון
  const userId = this.authService.getUserId();
  if (userId > 0) {
    this.orderService.getUserOrders(userId).subscribe({
      next: (userResponse: any) => {
        const orders = userResponse.orders || [];
        const draft = orders.find((o: any) => o.status === 0) || orders[0];
        if (draft && draft.ordersPackages) {
          const qtys: any = {};
          draft.ordersPackages.forEach((p: any) => {
            qtys[p.idPackage] = p.quantity;
          });
          this.packageQuantities.set(qtys); // הכמויות יופיעו בסימנים הירוקים בדף הבית
        }
      }
    });
  }
}

  handlePackageUpdate(packageId: number, action: 'increment' | 'decrement') {
    const userId = this.authService.getUserId();
    if (!userId) { this.router.navigate(['/register']); return; }

    const currentQty = this.packageQuantities()[packageId] || 0;
    const newQty = action === 'increment' ? currentQty + 1 : currentQty - 1;
    if (newQty < 0) return;

    this.orderService.updatePackageQuantity(userId, packageId, newQty).subscribe(() => {
      this.packageQuantities.update(q => ({ ...q, [packageId]: newQty }));
    });
  }
}