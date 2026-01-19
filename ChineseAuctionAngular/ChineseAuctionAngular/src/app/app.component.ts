import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './component/register/register.component';
import { Header } from './component/header/header.component';
import { Footer } from './component/footer/footer.component';
import { Home } from './component/home/home.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RegisterComponent,Header,Footer,Home],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ChineseAuction_Angular';
}
