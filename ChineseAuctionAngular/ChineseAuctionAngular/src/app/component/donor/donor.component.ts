import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonorService } from '../../services/donor.service';
import { DonorDTO, DonorCreateDTO } from '../../models/DonorDTO';
import { Gift } from '../../models/GiftDTO';
import { environment } from '../../../../environment';
import { Subject, debounceTime, distinctUntilChanged, Observable } from 'rxjs';

// ייבוא הקומפוננטות החיצוניות
import { DonorGiftsComponent } from './donor-gifts/donor-gifts.component';
import { AddGiftComponent } from './add-gift/add-gift.component';

@Component({
  selector: 'app-donor',
  standalone: true,
  imports: [CommonModule, FormsModule, DonorGiftsComponent, AddGiftComponent],
  templateUrl: './donor.component.html',
  styleUrl: './donor.component.scss'
})
export class DonorComponent implements OnInit {
  private donorService = inject(DonorService);
  
  donors: DonorDTO[] = [];
  donorGifts: { [key: number]: Gift[] } = {};
  expandedDonorId: number | null = null;
  addingGiftToDonorId: number | null = null; 
  
  showAddModal = false;
  showEditModal = false;
  donorToDelete: DonorDTO | null = null;
  
  newDonor: DonorCreateDTO = new DonorCreateDTO();
  editingDonor: DonorDTO | null = null;
  
  searchQuery: string = '';
  currentFilter: 'name' | 'email' | 'gift' = 'name';
  activeFilterName: string = 'שם';
  isLoading: boolean = false;
  imageBaseUrl = `${environment.apiUrl}/images/gift/`;

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.loadDonors();
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => this.executeSearch(query));
  }

  loadDonors() {
    this.isLoading = true;
    this.donorService.getAllDonors().subscribe({
      next: (data: DonorDTO[]) => {
        this.donors = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  toggleGifts(donor: DonorDTO) {
    const id = donor.idDonor;
    if (this.expandedDonorId === id) {
      this.expandedDonorId = null;
      return;
    }
    this.expandedDonorId = id;
    this.addingGiftToDonorId = null; 

    if (!this.donorGifts[id]) {
      this.donorService.getGiftsByDonorId(donor.firstName).subscribe(gifts => {
        this.donorGifts[id] = gifts || [];
      });
    }
  }

  confirmAddGift(donor: DonorDTO) {
    this.addingGiftToDonorId = this.addingGiftToDonorId === donor.idDonor ? null : donor.idDonor;
    this.expandedDonorId = null; 
  }

  onGiftAddedSuccessfully(donorId: number) {
    this.addingGiftToDonorId = null;
    const donor = this.donors.find(d => d.idDonor === donorId);
    if (donor) {
      this.donorService.getGiftsByDonorId(donor.firstName).subscribe(gifts => {
        this.donorGifts[donorId] = gifts || [];
        this.expandedDonorId = donorId; 
      });
    }
  }

  openEditModal(donor: DonorDTO) {
    this.editingDonor = { ...donor };
    this.showEditModal = true;
  }

  submitEditDonor() {
    if (this.editingDonor) {
      this.donorService.updateDonor(this.editingDonor.idDonor, new DonorCreateDTO(this.editingDonor)).subscribe(() => {
        const idx = this.donors.findIndex(d => d.idDonor === this.editingDonor?.idDonor);
        if (idx !== -1) this.donors[idx] = this.editingDonor!;
        this.showEditModal = false;
      });
    }
  }

  submitAddDonor() {
    this.donorService.createDonor(this.newDonor).subscribe(id => {
      const addedDonor = new DonorDTO({ idDonor: id, ...this.newDonor });
      this.donors.push(addedDonor);
      this.showAddModal = false;
      this.newDonor = new DonorCreateDTO();
    });
  }

  confirmDelete(donor: DonorDTO) {
    this.donorToDelete = donor;
  }

  executeDelete() {
    if (this.donorToDelete) {
      this.donorService.deleteDonor(this.donorToDelete.idDonor).subscribe(() => {
        this.donors = this.donors.filter(d => d.idDonor !== this.donorToDelete?.idDonor);
        this.donorToDelete = null;
      });
    }
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
  }

  executeSearch(query: string) {
    if (!query.trim()) {
      this.loadDonors();
      return;
    }
    this.isLoading = true;
    let obs: Observable<any>;
    switch (this.currentFilter) {
      case 'email': obs = this.donorService.sortByEmail(query); break;
      case 'gift': obs = this.donorService.sortByGift(query); break;
      default: obs = this.donorService.sortByName(query); break;
    }
    obs.subscribe({
      next: (data) => {
        this.donors = Array.isArray(data) ? data : (data ? [data] : []);
        this.isLoading = false;
      },
      error: () => { this.donors = []; this.isLoading = false; }
    });
  }

  setFilter(filter: 'name' | 'email' | 'gift', name: string) {
    this.currentFilter = filter;
    this.activeFilterName = name;
    if (this.searchQuery) this.executeSearch(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.loadDonors();
  }
}