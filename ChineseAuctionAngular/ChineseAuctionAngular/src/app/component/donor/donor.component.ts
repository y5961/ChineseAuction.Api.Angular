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
  
  donors: DonorDTO[] = [];
  donorGifts: { [key: number]: Gift[] } = {};
  expandedDonorId: number | null = null;
  
  showAddModal = false;
  showEditModal = false;
  donorToDelete: DonorDTO | null = null;
  
  newDonor: DonorCreateDTO = new DonorCreateDTO();
  editingDonor: DonorDTO | null = null;
  
  searchQuery: string = '';
  currentFilter: 'name' | 'email' | 'gift' = 'name';
  activeFilterName: string = 'שם';
  private searchSubject = new Subject<string>();

  imageBaseUrl = `${environment.apiUrl}/images/gift/`;

  ngOnInit(): void {
    this.loadDonors();
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
    this.searchQuery = '';
    this.loadDonors();
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
  }

executeSearch() {
  const q = this.searchQuery.trim();
  if (!q) {
    this.loadDonors();
    return;
  }

  switch (this.currentFilter) {
    case 'name': 
      this.donorService.sortByName(q).subscribe(res => this.donors = res || []); 
      break;
    case 'email': 
      this.donorService.sortByEmail(q).subscribe(res => this.donors = res || []); 
      break;
    case 'gift': 
      this.donorService.sortByGift(q).subscribe(res => {
        // מכיוון שחוזר אובייקט אחד, נשים אותו בתוך מערך כדי שה-ngFor לא יישבר
        this.donors = res ? [res] : [];
      }); 
      break;
  }
}
// שינוי החתימה מ-donorId: number ל-donor: DonorDTO
toggleGifts(donor: DonorDTO): void {
  const id = donor.idDonor; // לצורך ניהול ה-Expanded
  
  if (this.expandedDonorId === id) {
    this.expandedDonorId = null;
    return;
  }
  this.expandedDonorId = id;

  if (!this.donorGifts[id]) {
    // שליחת ה-firstName (string) כפי שה-Service מצפה
    this.donorService.getGiftsByDonorId(donor.firstName).subscribe(gifts => {
      this.donorGifts[id] = gifts || [];
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
      this.donors.push(new DonorDTO({ idDonor: id, ...this.newDonor }));
      this.showAddModal = false;
      this.newDonor = new DonorCreateDTO();
    });
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