import { Component, inject, signal } from '@angular/core';
import { PackageService } from '../../Services/package';

@Component({
  selector: 'app-packages',
  imports: [],
  templateUrl: './packages.html',
  styleUrl: './packages.scss',
})
export class Packages {
 packages = signal<any[]>([]); 
  private giftService = inject(PackageService);

  ngOnInit() {
    console.log(' Gifts component loaded');
    this.loadGifts();
  }

  loadGifts() {
    this.giftService.getAllPackages().subscribe({
      next: (res: any[]) => {
        console.log(' Formatted packages:', res);
        this.packages.set(res);
      },
      error: (err) => {
        console.error('Error details:', err.error || err.message);
      }
    });
  }
}
