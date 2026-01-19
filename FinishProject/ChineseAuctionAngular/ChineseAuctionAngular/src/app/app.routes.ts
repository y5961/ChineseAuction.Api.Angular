import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { NotFound } from './components/not-found/not-found';
import { Gifts } from './components/gifts/gifts';
import { Packages } from './components/packages/packages';
import { AboutUs } from './components/about-us/about-us';

export const routes: Routes = [

    {path: 'login', component: Login, pathMatch: 'full'},
    {path: 'register', component: Register, pathMatch: 'full'},
    {path:'',component:Home, pathMatch:'full'},
    {path: 'gifts', component: Gifts, pathMatch: 'full'},
    {path: 'packages', component: Packages, pathMatch: 'full'},
    {path: 'about', component: AboutUs, pathMatch: 'full'},
    {path:'**',component:NotFound, pathMatch:'full'},

];
