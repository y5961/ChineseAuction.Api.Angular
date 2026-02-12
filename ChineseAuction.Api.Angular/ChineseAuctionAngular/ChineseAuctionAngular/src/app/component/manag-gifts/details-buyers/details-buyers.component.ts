import { Component, Input, Output, EventEmitter, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftService } from '../../../services/gift.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-details-buyers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-buyers.component.html'
})
export class DetailsBuyersComponent implements OnInit {
  @Input() giftId!: number;
  @Input() giftName: string = '';
  @Output() close = new EventEmitter<void>();

  private giftService = inject(GiftService);
  private orderService = inject(OrderService);
  buyers = signal<any[]>([]);

  ngOnInit() {
    // Prefer OrderService purchasers endpoint; fallback to GiftService participants
    this.orderService.getPurchasersByGiftId(this.giftId).subscribe({
      next: (res) => this.buyers.set(res || []),
      error: () => {
        this.giftService.getParticipantsByGiftId(this.giftId).subscribe({
          next: (data) => this.buyers.set(data || []),
          error: (err) => console.error('Error loading buyers from both endpoints:', err)
        });
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}