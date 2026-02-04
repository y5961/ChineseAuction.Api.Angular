import { Component } from '@angular/core';
<<<<<<< HEAD
import { environment } from '../../../../enviroment';
=======
import { environment } from '../../../../environment';
>>>>>>> origin/main

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class Footer {
<<<<<<< HEAD
imageUrl = (environment?.apiUrl || '') + '/images/main/';
=======
  imageUrl = environment.apiUrl + '/images/main/';
>>>>>>> origin/main
}
