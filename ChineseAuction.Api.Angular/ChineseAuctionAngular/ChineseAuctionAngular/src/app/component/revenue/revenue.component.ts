import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- וודאי שזה מיובא
import { OrderService } from '../../services/order.service';
import { IncomeReport } from '../../models/Income-report';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [CommonModule], // <--- להוסיף כאן את CommonModule
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.scss'
})
export class RevenueComponent implements OnInit {
  private orderService = inject(OrderService);
  
  public reportData = signal<IncomeReport | null>(null);
  public loading = signal<boolean>(true);

  ngOnInit() {
    this.orderService.getIncomeReport().subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading.set(false);
      }
    });
  }
}

export { RevenueComponent as PurchasesComponent };