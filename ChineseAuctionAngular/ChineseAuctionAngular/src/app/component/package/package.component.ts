import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { PackageDTO } from '../../models/PackageDTO';
import { Router } from '@angular/router';
import { environment } from '../../../../environment';

@Component({
  selector: 'app-package',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss'
})
export class PackageComponent implements OnInit {
  imageUrl = environment.apiUrl + '/images/packages/';
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
  const currentQty = this.packageQuantities()[packageId] || 0;
  const newQty = action === 'increment' ? currentQty + 1 : currentQty - 1;
  
  if (newQty < 0) return;
  this.cartService.setQuantity(packageId, newQty);
  const userId = this.authService.getUserId();
  this.orderService.updatePackageQuantity(userId, packageId, newQty).subscribe({
    next: () => {
    },
    error: (err) => {
      this.cartService.setQuantity(packageId, currentQty);
    }
  });
}

  // handlePackageUpdate(packageId: number, action: 'increment' | 'decrement') {
  //   const userId = this.authService.getUserId();
  //   if (!userId) { 
  //     this.router.navigate(['/register']); 
  //     return; 
  //   }

  //   const currentQty = this.packageQuantities()[packageId] || 0;
  //   const newQty = action === 'increment' ? currentQty + 1 : currentQty - 1;
  //   if (newQty < 0) return;

  //   this.orderService.updatePackageQuantity(userId, packageId, newQty).subscribe(() => {
  //     this.cartService.setQuantity(packageId, newQty);
      
  //     if (newQty === 1 && action === 'increment') {
  //       this.loadUserData();
  //     }
  //   });
  // }
  getPackageGradient(id: number): string {
    const gradients = [
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // ירוק
      'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)', // כחול
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // ורוד-אדום
      'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'  // כתום
    ];
    // אנחנו משתמשים ב-Modulo (%) כדי שאם יש יותר מ-4 חבילות, הצבעים יחזרו על עצמם
    return gradients[id % gradients.length];
  }

  getPackageImage(id: number): string {
    const images = ['p-green.png', 'p-blue.png', 'p-pink.png', 'p-red.png'];
    return images[id % images.length];
  }
}