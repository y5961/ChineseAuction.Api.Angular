import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { GiftComponent } from './component/gift/gift.component';
import { PackageComponent } from './component/package/package.component';
import { TaskManagerComponent } from './component/task-manager/task-manager.component';
import { DonorsComponent } from './component/donors/donors.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'register', component: RegisterComponent, pathMatch: 'full' },
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'gift', component: GiftComponent, pathMatch: 'full' },
    { path: 'package', component: PackageComponent, pathMatch: 'full' },
    { path: 'task-manager', 
    component: TaskManagerComponent, 
    children: [
        { path: 'manage-gifts', component: GiftComponent },
        { path: 'manage-packages', component: PackageComponent },
        { path: 'donors', component: DonorsComponent },
    ],
    },
    { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

