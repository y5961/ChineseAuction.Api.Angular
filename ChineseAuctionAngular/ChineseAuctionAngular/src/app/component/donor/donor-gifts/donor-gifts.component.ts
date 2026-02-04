import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gift } from '../../../models/GiftDTO';

@Component({
  selector: 'app-donor-gifts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donor-gifts.component.html',
  styleUrl: './donor-gifts.component.scss'
})
export class DonorGiftsComponent {
  @Input() gifts: Gift[] = [];
  @Input() donorName: string = '';
  @Input() imageBaseUrl: string = '';
}