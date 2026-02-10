import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service'; 
import { OrderStatus } from '../../models/OrderDTO'; 
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-buying',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buying.component.html',
  styleUrls: ['./buying.component.scss']
})
export class BuyingComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService); 
  private router = inject(Router); 
  
  isLoading: boolean = false;
  currentOrder: any = null; 
  isCompleted: boolean = false;

  ngOnInit() {
    this.loadDraftOrder();
  }

  loadDraftOrder() {
    const userId = this.authService?.getUserId();
    if (!userId) return;

    this.orderService.getUserOrders(userId).subscribe({
      next: (res: any) => {
        const ordersArray = Array.isArray(res) ? res : res?.orders;
        if (ordersArray && ordersArray.length > 0) {
          // חיפוש הזמנה בסטטוס טיוטה (0)
          const draft = ordersArray.find((o: any) => o.status === OrderStatus.Draft);
          this.currentOrder = draft;
          
          // אם אין טיוטה, ייתכן שההזמנה האחרונה כבר הושלמה
          if (!this.currentOrder) {
             const lastOrder = ordersArray[0];
             if (lastOrder.status === OrderStatus.Completed) {
                this.currentOrder = lastOrder;
                this.isCompleted = true;
             }
          }
        }
      },
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  onCompleteOrder() {
    const orderId = this.currentOrder?.idOrder;
    if (!orderId) return;

    this.isLoading = true;
    // מעדכנים את הקריאה לשרת כדי שתצפה לטקסט ולא ל-JSON
    this.orderService.completeOrder(orderId).subscribe({
      next: () => {
        this.isLoading = false;
        this.isCompleted = true;
      },
      error: (err) => {
        this.isLoading = false;
        // אם הסטטוס הוא 200, זה אומר שהפעולה הצליחה בשרת ורק ה-Parsing נכשל
        if (err.status === 200) {
          this.isCompleted = true;
        } else {
          alert('חלה שגיאה בסגירת ההזמנה');
        }
      }
    });
  }

  goToHome() {
    this.router.navigate(['/']); 
  }
}