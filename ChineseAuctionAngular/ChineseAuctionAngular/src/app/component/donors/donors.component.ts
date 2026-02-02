import { Component, inject, signal } from '@angular/core';
import { DonorService } from '../../services/donor.service';
import { Donor } from '../../models/DonorDTO';

@Component({
  selector: 'app-donors',
  imports: [],
  templateUrl: './donors.component.html',
  styleUrl: './donors.component.scss'
})
export class DonorsComponent {
  // private donorService = inject(DonorService);
  // donors = signal<Donor[]>([]);
  // constructor() {
  //   this.loadDonors();
  // }

  // loadDonors() {
  //   this.donorService.getAllDonors() .subscribe({
  //       next: (data) => {
  //           const initializedDonors = data.map(g => {
  //             const donor = new Donor(g);
  //             return donor;
  //           });
  //           this.donors.set(initializedDonors);
  //         },
  //         error: (err: any) => {
  //           console.error('שגיאה בטעינת הנתונים', err);
  //         }
  //       });
  // }

}

