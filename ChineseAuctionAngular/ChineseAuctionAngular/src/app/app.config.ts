import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// ייבואים עבור PrimeNG 18/19 (הגרסה המודרנית)
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    
    // הגדרות עיצוב ואנימציה מתקדמות
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
                // 'none' מבטיח שהעיצוב לא ישתנה פתאום לשחור אם המחשב במצב לילה
                darkModeSelector: '.none', 
                cssLayer: false // עוזר למנוע התנגשויות עם ספריות CSS אחרות
            }
        },
        ripple: true // מוסיף אפקט לחיצה (אנימציה) מטורף על הכפתורים
    })
  ]
};