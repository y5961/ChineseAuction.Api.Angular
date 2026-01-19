import { Component, OnInit } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenu } from 'primeng/megamenu';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TabsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

 export class Header implements OnInit {
  tabs: { title: string; value: number;}[] = [];

    ngOnInit() {
        this.tabs = [
             { title: 'החבילות', value: 0 },
             { title: 'הפרסים', value: 1 },
             { title: 'הכספת', value: 2 },
             { title: 'על ההגרלה', value: 3 },
             { title: 'מי אנחנו', value: 4 },
             { title: 'דברו איתנו', value: 5 }
        ];
    }
}
