import { Component, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MegaMenu } from 'primeng/megamenu';
import { Button } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TabsModule } from 'primeng/tabs'; 
import { MegaMenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MegaMenu, Button, Ripple, TabsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  tabs: any[] = [];
  private router = inject(Router);
  
  items: MegaMenuItem[] | undefined;

  activeIndex: number = 0;

ngOnInit() {
    this.tabs = [
      { title: 'החבילות', value: 'packages' },
      { title: 'הפרסים', value: 'gifts' },
      { title: 'הרשמה', value: 'register' }, 
      { title: 'כניסה', value: 'login' }, 
      { title: 'על ההגרלה', value: 'about' },
      { title: 'מי אנחנו', value: 'us' },
      { title: 'דברו איתנו', value: 'contact' }
    ];
  

    this.items = [
      { label: 'דף הבית', icon: 'pi pi-home' }
    ];
  }

  onTabChange(path: string) {
    this.router.navigate([`/${path}`]);
  }
}

