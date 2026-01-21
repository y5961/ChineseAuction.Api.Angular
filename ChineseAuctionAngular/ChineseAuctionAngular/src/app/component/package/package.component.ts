import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';
import { PackageDTO } from '../../models/PackageDTO';

@Component({
  selector: 'app-package',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss'
})
export class PackageComponent implements OnInit {
  private packageService = inject(PackageService);

  // 1. Signal המחזיק את רשימת החבילות מהשרת
  packages = signal<PackageDTO[]>([]);

  // 2. Signal לניהול הכמויות שנבחרו לכל חבילה (מפתח: idPackage, ערך: כמות)
  // שימוש ב-Record מאפשר גישה קלה ב-HTML לפי ID
  packageQuantities = signal<Record<number, number>>({});

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.packageService.getAllPackages().subscribe({
      next: (data: PackageDTO[]) => {
        this.packages.set(data);
        
        // אתחול אופציונלי של כל הכמויות ל-0
        const initialQuantities: Record<number, number> = {};
        data.forEach(pkg => {
          initialQuantities[pkg.idPackage] = 0;
        });
        this.packageQuantities.set(initialQuantities);
      },
      error: (err) => {
        console.error('שגיאה בטעינת החבילות:', err);
      }
    });
  }

  // 3. פונקציה להגדלת כמות - מקבלת את ה-ID של החבילה
  increment(packageId: number): void {
    this.packageQuantities.update(q => ({
      ...q,
      [packageId]: (q[packageId] || 0) + 1
    }));
  }

  // 4. פונקציה להפחתת כמות - מקבלת את ה-ID של החבילה
  decrement(packageId: number): void {
    this.packageQuantities.update(q => {
      const currentQty = q[packageId] || 0;
      if (currentQty <= 0) return q; // מניעת ירידה מתחת ל-0
      
      return {
        ...q,
        [packageId]: currentQty - 1
      };
    });
  }

  // פונקציית עזר למקרה שתרצי לשלוח את הנתונים לסל בהמשך
  getSelectedPackages() {
    return this.packages().filter(p => (this.packageQuantities()[p.idPackage] || 0) > 0);
  }
}