import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { interval, Subscription } from 'rxjs';
import { Game } from 'src/app/Models/Game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-gameclock',
  standalone: true,
  imports: [CommonModule,MatCard,MatCardContent,MatIcon],
  templateUrl: './gameclock.component.html',
  styleUrl: './gameclock.component.scss'
})
export class GameclockComponent implements OnInit, OnDestroy {
  virtualTime: Date = new Date();
  private updateSubscription!: Subscription;
  @Input() game:Game;
  // Replace these with actual game details
  private gameStartDate: Date = new Date('2024-01-01T00:00:00');
  private gameEndDate: Date = new Date('2024-02-31T23:59:59');
  private virtualStartDate: Date = new Date('2024-01-01T00:00:00');
  private simulationDays: number = 1000;

  constructor(private virtualTimeService: GameService) {}

  ngOnInit(): void {
    this.gameStartDate = this.game.startDate;
    this.gameEndDate = this.game.endDate;
    this.virtualStartDate = this.game.virtualStartDate;
    this.simulationDays = this.game.simulationDays;
    // Update virtual time every second
    this.updateSubscription = interval(1000).subscribe(() => {
      this.virtualTime = this.virtualTimeService.calculateVirtualTime(
        this.gameStartDate,
        new Date(), // Current real time
        this.gameEndDate,
        this.virtualStartDate,
        this.simulationDays
      );
    });
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }


}
