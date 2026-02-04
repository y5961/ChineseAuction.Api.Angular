import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GiftService } from '../../services/gift.service';
import { Gift } from '../../models/GiftDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterLink } from '@angular/router';
import { DonorService } from '../../services/donor.service';
// import { CategoryService } from '../../services/category.service';
@Component({
  selector: 'app-manage-edit-gift',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-edit-gift.component.html'
})
export class ManageEditGiftComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private giftService = inject(GiftService);
categories = signal<any[]>([]); // רשימת הקטגוריות להצגה ב-Select
  donors = signal<any[]>([]);
  // private categoryService = inject(CategoryService);
  private donorService = inject(DonorService);
  giftToEdit = signal<Gift | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Editing gift with ID:', id);
    // this.categoryService.getAll().subscribe(res => this.categories.set(res));
    this.donorService.getAllDonors().subscribe(res => this.donors.set(res));
    if (id) {
      this.loadGiftDetails(id);
    }
  }

  loadGiftDetails(id: number): void {
    this.giftService.getGiftById(id).subscribe({
      next: (gift) => {
        this.giftToEdit.set(gift);
      },
      error: (err) => {
        console.error('שגיאה בטעינת פרטי המתנה', err);
      }
    });
  }

  saveChanges(): void {
    const updatedGift = this.giftToEdit();
    if (updatedGift) {
      // כאן תבצעי קריאה ל-Service לעדכון (PUT)
      console.log('שומר שינויים עבור:', updatedGift);
    }
  }
}