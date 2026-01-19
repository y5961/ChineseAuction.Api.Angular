import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './component/register/register.component';
import { Header } from './component/header/header.component';
import { Footer } from './component/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { Gift } from './models/GiftDTO';
import { GiftComponent } from './component/gift/gift.component';
import { PackageComponent } from './component/package/package.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RegisterComponent,Header,Footer,HomeComponent,LoginComponent,NotFoundComponent,GiftComponent,PackageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ChineseAuction_Angular';
}
