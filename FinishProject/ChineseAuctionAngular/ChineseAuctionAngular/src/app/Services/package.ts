import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Package, PackageDto } from '../models/PackageDto';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = 'https://localhost:xxxx/api/Package'; // יש לעדכן פורט

  constructor(private http: HttpClient) { }

  // GET /api/Package
  getAllPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(this.apiUrl).pipe(
      map(data => data.map(p => new Package(p)))
    );
  }

  // POST /api/Package
  createPackage(packageDto: PackageDto): Observable<Package> {
    return this.http.post<Package>(this.apiUrl, packageDto).pipe(
      map(p => new Package(p))
    );
  }

  // GET /api/Package/{id}
  getPackageById(id: number): Observable<PackageDto> {
    return this.http.get<PackageDto>(`${this.apiUrl}/${id}`).pipe(
      map(p => new PackageDto(p))
    );
  }

  // PUT /api/Package/{id}
  updatePackage(id: number, packageDto: PackageDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}`, packageDto);
  }

  // DELETE /api/Package/{id}
  deletePackage(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}