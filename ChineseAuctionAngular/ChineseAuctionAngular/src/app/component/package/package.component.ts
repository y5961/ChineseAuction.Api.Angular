import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { PackageDTO } from '../../models/PackageDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-package',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss'
})
export class PackageComponent implements OnInit {
  private packageService = inject(PackageService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  packages = signal<PackageDTO[]>([]);
  packageQuantities = this.cartService.packageQuantities;

  ngOnInit() {
    this.packageService.getAllPackages().subscribe((data: PackageDTO[]) => {
      this.packages.set(data);
    });

    this.loadUserData();
  }

  loadUserData() {
    const userId = this.authService.getUserId();
    if (userId > 0) {
      this.orderService.getUserOrders(userId).subscribe({
        next: (userResponse: any) => {
          const draft = userResponse.orders?.find((o: any) => o.status === 0);
          if (draft) {
            const qtys: Record<number, number> = {};
            draft.ordersPackages.forEach((p: any) => {
              qtys[p.idPackage] = p.quantity;
            });
            this.cartService.setAllQuantities(qtys);
            this.cartService.setCartItems(draft.ordersPackages);
          }
        }
      });
    }
  }

  handlePackageUpdate(packageId: number, action: 'increment' | 'decrement') {
    const userId = this.authService.getUserId();
    if (!userId) { 
      this.router.navigate(['/register']); 
      return; 
    }

    const currentQty = this.packageQuantities()[packageId] || 0;
    const newQty = action === 'increment' ? currentQty + 1 : currentQty - 1;
    if (newQty < 0) return;

    this.orderService.updatePackageQuantity(userId, packageId, newQty).subscribe(() => {
      this.cartService.setQuantity(packageId, newQty);
      
      if (newQty === 1 && action === 'increment') {
        this.loadUserData();
      }
    });
  }
}