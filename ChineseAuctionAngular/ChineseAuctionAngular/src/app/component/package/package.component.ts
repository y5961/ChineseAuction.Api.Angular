import { Component, OnInit, inject, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';
import { PackageDTO } from '../../models/PackageDTO'; // שימוש ב-DTO כפי שראינו בשגיאה הקודמת

@Component({
  selector: 'app-package',
  standalone: true, // קריטי עבור פרויקטים מודרניים
  imports: [CommonModule],
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss'
})
export class PackageComponent implements OnInit {
  private packageService = inject(PackageService);
  
  // הגדרת ה-Signal עם הסוג הנכון (DTO)
  packages = signal<PackageDTO[]>([]);

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.packageService.getAllPackages().subscribe({
      next: (data) => {
        this.packages.set(data);
      },
      error: (err) => {
        console.error('שגיאה בטעינת הנתונים', err);
      }
    });
  }
}