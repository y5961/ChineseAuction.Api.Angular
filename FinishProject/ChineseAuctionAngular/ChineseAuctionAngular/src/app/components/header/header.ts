import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MegaMenu } from 'primeng/megamenu';
import { Button } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TabsModule } from 'primeng/tabs'; 
import { MegaMenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MegaMenu, Button, Ripple, TabsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  tabs: any[] = [];
  
  items: MegaMenuItem[] | undefined;
  
  activeIndex: number = 0;

  ngOnInit() {
    this.tabs = [
      { title: 'החבילות', value: 0 },
      { title: 'הפרסים', value: 1 },
      { title: 'הכספת', value: 2 },
      { title: 'על ההגרלה', value: 3 },
      { title: 'מי אנחנו', value: 4 },
      { title: 'דברו איתנו', value: 5 }
    ];

    this.items = [
      { label: 'דף הבית', icon: 'pi pi-home' }
    ];
  }
}