import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftService } from '../../services/gift.service';
import { Gift } from '../../models/GiftDTO';
import { interval, Subscription } from 'rxjs';
import { environment } from '../../../../environment';

@Component({
  selector: 'app-raffle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './raffle.component.html',
  styleUrl: './raffle.component.scss'
})
export class RaffleComponent implements OnInit {
  private giftService = inject(GiftService);
  
  imageUrl = environment.apiUrl + '/images/gift/';
  gifts = signal<Gift[]>([]);
  currentGift = signal<Gift | null>(null);
  participants = signal<string[]>([]); 
  winnersList = signal<{ gift: string, winner: string }[]>([]);
  
  displayText = signal<string>('מוכנים?');
  isSpinning = signal<boolean>(false);
  selectedWinner = signal<string | null>(null);

  private spinSubscription?: Subscription;

  ngOnInit() {
    this.loadGifts();
  }

  loadGifts() {
    this.giftService.getAllGifts().subscribe({
      next: (data) => this.gifts.set(data),
      error: (err) => console.error('Error loading gifts', err)
    });
  }

  selectGift(gift: Gift) {
    if (this.isSpinning()) return;
    
    this.currentGift.set(gift);
    this.selectedWinner.set(null);
    this.displayText.set('טוען משתתפים...');

    this.giftService.getParticipantsByGiftId(gift.idGift).subscribe({
      next: (names: string[]) => {
        this.participants.set(names);
        this.displayText.set(names.length > 0 ? 'מוכנים?' : 'אין משתתפים');
      },
      error: () => this.participants.set([])
    });
  }

  startRaffle() {
    if (this.participants().length === 0 || this.isSpinning()) return;

    this.isSpinning.set(true);
    this.selectedWinner.set(null);
    
    this.spinSubscription = interval(80).subscribe(() => {
      const names = this.participants();
      const randomIndex = Math.floor(Math.random() * names.length);
      this.displayText.set(names[randomIndex]);
    });
  }

  stopRaffle() {
    const gift = this.currentGift();
    if (!gift || !this.isSpinning()) return;

    this.giftService.drawWinnerForGift(gift.idGift).subscribe({
      next: (res) => {
        // עצירת האנימציה רק כשהתשובה מהשרת הגיעה
        this.spinSubscription?.unsubscribe();
        
        // חילוץ שם הזוכה (השרת מחזיר WinnerUserId או WinnerName)
        const winnerName = res.winnerName || `זוכה מספר ${res.winnerUserId}`;
        
        this.displayText.set(winnerName);
        this.selectedWinner.set(winnerName);
        this.isSpinning.set(false);
        this.launchConfetti();
        this.winnersList.update(prev => [
          { gift: gift.name, winner: winnerName },
          ...prev
        ]);
      },
      error: (err) => {
        this.spinSubscription?.unsubscribe();
        this.isSpinning.set(false);
        this.displayText.set("שגיאה בהגרלה");
      }
    });
  }
  launchConfetti() {
    throw new Error('Method not implemented.');
  }

  // פונקציה לייצוא דו"ח (CSV) כפי שמופיע בכפתור הצהוב שלך
  exportWinnersReport() {
    if (this.winnersList().length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,מתנה,זוכה\n";
    this.winnersList().forEach(item => {
      csvContent += `${item.gift},${item.winner}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "winners_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}