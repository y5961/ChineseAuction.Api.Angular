import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { GiftComponent } from './component/gift/gift.component';
import { PackageComponent } from './component/package/package.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'register', component: RegisterComponent, pathMatch: 'full' },
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'gift', component: GiftComponent, pathMatch: 'full' },
    { path: 'package', component: PackageComponent, pathMatch: 'full' },
    { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];