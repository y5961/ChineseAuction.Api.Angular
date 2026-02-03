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
  
  // ניהול מודלים (Modals)
  showAddModal = false;
  showEditModal = false;
  donorToDelete: DonorDTO | null = null;
  
  // אובייקטים לעריכה והוספה
  newDonor: DonorCreateDTO = new DonorCreateDTO();
  editingDonor: DonorDTO | null = null;
  
  // חיפוש וסינון
  searchQuery: string = '';
  currentFilter: 'name' | 'email' | 'gift' = 'name';
  activeFilterName: string = 'שם';
  isLoading: boolean = false; // אינדיקטור טעינה
  private searchSubject = new Subject<string>();

  imageBaseUrl = `${environment.apiUrl}/images/gift/`;

  ngOnInit(): void {
    this.loadDonors();
    
    // הגדרת ה-Pipe לחיפוש עם השהייה (Debounce)
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => this.executeSearch());
  }

  // טעינת כל התורמים
  loadDonors() {
    this.isLoading = true;
    this.donorService.getAllDonors().subscribe({
      next: (data) => {
        this.donors = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  // שינוי סוג המסנן - מבצע חיפוש חוזר עם הטקסט הקיים
  setFilter(filter: 'name' | 'email' | 'gift', name: string) {
    this.currentFilter = filter;
    this.activeFilterName = name;
    
    // אם יש טקסט בתיבה, נבצע חיפוש לפי הקטגוריה החדשה מיד
    if (this.searchQuery.trim()) {
      this.executeSearch();
    }
  }

  // ניקוי תיבת החיפוש
  clearSearch() {
    this.searchQuery = '';
    this.loadDonors();
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
  }

  // פונקציית החיפוש המרכזית
  executeSearch() {
    const q = this.searchQuery.trim();
    
    if (!q) {
      this.loadDonors();
      return;
    }

    this.isLoading = true;

    // פונקציית עזר לטיפול בתשובה מהשרת
    const handleResponse = (res: any) => {
      // אם התוצאה היא מערך - נשמור אותו, אם אובייקט בודד (מתנה) - נעטוף במערך
      this.donors = Array.isArray(res) ? res : (res ? [res] : []);
      this.isLoading = false;
    };

    const handleError = () => {
      this.donors = [];
      this.isLoading = false;
    };

    switch (this.currentFilter) {
      case 'name': 
        this.donorService.sortByName(q).subscribe({ next: handleResponse, error: handleError }); 
        break;
      case 'email': 
        this.donorService.sortByEmail(q).subscribe({ next: handleResponse, error: handleError }); 
        break;
      case 'gift': 
        this.donorService.sortByGift(q).subscribe({ next: handleResponse, error: handleError }); 
        break;
    }
  }

  // ניהול רשימת מתנות לתורם (Accordion)
  toggleGifts(donor: DonorDTO): void {
    const id = donor.idDonor;
    
    if (this.expandedDonorId === id) {
      this.expandedDonorId = null;
      return;
    }
    this.expandedDonorId = id;

    if (!this.donorGifts[id]) {
      this.donorService.getGiftsByDonorId(donor.firstName).subscribe(gifts => {
        this.donorGifts[id] = gifts || [];
      });
    }
  }

  // פעולות עריכה
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

  // פעולות הוספה
  submitAddDonor() {
    this.donorService.createDonor(this.newDonor).subscribe(id => {
      const addedDonor = new DonorDTO({ idDonor: id, ...this.newDonor });
      this.donors.push(addedDonor);
      this.showAddModal = false;
      this.newDonor = new DonorCreateDTO();
    });
  }

  // פעולות מחיקה
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
}