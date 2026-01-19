import { Component, OnInit,inject } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenu } from 'primeng/megamenu';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TabsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

 export class Header implements OnInit {
  tabs: { title: string; value: string;}[] = [];
  private router = inject(Router);

    ngOnInit() {
        this.tabs = [
             { title: 'החבילות', value: 'package' },
             { title: 'הרשמה', value: 'register' },
             { title: 'כניסה', value: 'login' },
             { title: 'הפרסים', value: 'gift' },
             { title: 'הכספת', value: 'הכספת' },
             { title: 'על ההגרלה', value: 'על ההגרלה' },
             { title: 'מי אנחנו', value: 'מי אנחנו' },
             { title: 'דברו איתנו', value: 'דברו איתנו' }
        ];
    }
    onTabChange(path: string) {
        this.router.navigate([`${path}`]);
    }
  }