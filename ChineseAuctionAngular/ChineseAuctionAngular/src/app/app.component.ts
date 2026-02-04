import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { RegisterComponent } from './component/register/register.component';
import { Header } from './component/header/header.component';
import { Footer } from './component/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { Gift } from './models/GiftDTO';
import { GiftComponent } from './component/gift/gift.component';
import { PackageComponent } from './component/package/package.component';
import { CartComponent } from './component/cart/cart.component';
import { map } from 'rxjs/internal/operators/map';
import { filter } from 'rxjs/internal/operators/filter';
import { toSignal } from '@angular/core/rxjs-interop'; 

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header,Footer,CartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'ChineseAuction_Angular';
private router = inject(Router);
  showCart = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        const url = this.router.url;
        return !url.includes('task-manager') && !url.includes('manager');
      })
    ),
    { initialValue: true }
  );

}
