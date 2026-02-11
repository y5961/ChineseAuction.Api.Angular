import { Component } from '@angular/core';
import { environment } from '../../../../environment';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class Footer {
  imageUrl = environment.apiUrl + '/images/main/';
}
