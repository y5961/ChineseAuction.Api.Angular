import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonorService } from '../../services/donor.service';
import { DonorDTO, DonorCreateDTO } from '../../models/DonorDTO';
import { Gift } from '../../models/GiftDTO';
import { environment } from '../../../../environment';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-donor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donor.component.html',
  styleUrl: './donor.component.scss'
})
export class DonorComponent implements OnInit {
  private donorService = inject(DonorService);
  
  // נתונים
  donors: DonorDTO[] = [];
  donorGifts: { [key: number]: Gift[] } = {};
  expandedDonorId: number | null = null;
  
  // מצבי תצוגה (Modals)
  showAddModal = false;
  showEditModal = false;
  donorToDelete: DonorDTO | null = null;
  
  // טפסים
  newDonor: DonorCreateDTO = new DonorCreateDTO();
  editingDonor: DonorDTO | null = null;
  
  // סינון וחיפוש
  searchQuery: string = '';
  currentFilter: 'name' | 'email' | 'gift' = 'name';
  activeFilterName: string = 'שם';
  private searchSubject = new Subject<string>();

  imageBaseUrl = `${environment.apiUrl}/images/gift/`;

  ngOnInit(): void {
    this.loadDonors();

    // לוגיקת חיפוש דינמית
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => this.executeSearch());
  }

  loadDonors() {
    this.donorService.getAllDonors().subscribe(data => this.donors = data);
  }

  setFilter(filter: 'name' | 'email' | 'gift', name: string) {
    this.currentFilter = filter;
    this.activeFilterName = name;
    if (this.searchQuery) this.executeSearch();
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
  }

  executeSearch() {
    if (!this.searchQuery) {
      this.loadDonors();
      return;
    }

    switch (this.currentFilter) {
      case 'name':
        this.donorService.sortByName(this.searchQuery).subscribe(data => this.donors = data);
        break;
      case 'email':
        this.donorService.sortByEmail(this.searchQuery).subscribe(data => this.donors = data);
        break;
      case 'gift':
        this.donorService.sortByGift(this.searchQuery).subscribe(data => {
          this.donors = data ? [data] : [];
        });
        break;
    }
  }

  toggleGifts(donorId: number): void {
    if (this.expandedDonorId === donorId) {
      this.expandedDonorId = null;
      return;
    }
    this.expandedDonorId = donorId;
    if (!this.donorGifts[donorId]) {
      this.donorService.getGiftsByDonorId(donorId).subscribe(gifts => {
        this.donorGifts[donorId] = gifts;
      });
    }
  }

  // פעולות CRUD
  submitAddDonor() {
    this.donorService.createDonor(this.newDonor).subscribe(id => {
      this.donors.push(new DonorDTO({ idDonor: id, ...this.newDonor }));
      this.showAddModal = false;
      this.newDonor = new DonorCreateDTO();
    });
  }

  openEditModal(donor: DonorDTO) {
    this.editingDonor = { ...donor };
    this.showEditModal = true;
  }

  submitEditDonor() {
    if (this.editingDonor) {
      const dto = new DonorCreateDTO(this.editingDonor);
      this.donorService.updateDonor(this.editingDonor.idDonor, dto).subscribe(() => {
        const idx = this.donors.findIndex(d => d.idDonor === this.editingDonor?.idDonor);
        if (idx !== -1) this.donors[idx] = this.editingDonor!;
        this.showEditModal = false;
      });
    }
  }

  confirmDelete(donor: DonorDTO) { this.donorToDelete = donor; }

  executeDelete() {
    if (this.donorToDelete) {
      this.donorService.deleteDonor(this.donorToDelete.idDonor).subscribe(() => {
        this.donors = this.donors.filter(d => d.idDonor !== this.donorToDelete?.idDonor);
        this.donorToDelete = null;
      });
    }
  }
}