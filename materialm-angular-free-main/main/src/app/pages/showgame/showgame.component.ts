import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Gamelatestdata } from 'src/app/Models/Gamelatestdata';
import { GameService } from 'src/app/services/game.service';
import { GameclockComponent } from "../gameclock/gameclock.component";
import { Game } from 'src/app/Models/Game';
import { Gametrade } from 'src/app/Models/GameTrade';
import { GametradeService } from 'src/app/services/gametrade.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { News } from 'src/app/Models/News';
import { MatExpansionModule } from '@angular/material/expansion';
import { GamePortfolio } from 'src/app/Models/GamePortfolio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/Models/User';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GameportfolioService } from 'src/app/services/gameportfolio.service';

@Component({
  selector: 'app-showgame',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, MatCardModule, MatTableModule, GameclockComponent, CurrencyPipe, DatePipe, MatCardModule, MatExpansionModule, MatGridListModule, MatIconModule,MatProgressSpinnerModule],
  templateUrl: './showgame.component.html',
  styleUrl: './showgame.component.scss'
})
export class ShowgameComponent implements OnInit {
  latestData: Gamelatestdata[] = [];
  selectedCompanyId: number = 1; // Example company ID
  displayedColumns: string[] = ['companyName', 'latestPrice'];
  game!: Game;
  gameTrades: Gametrade[] = [];
  userId: number = 1;
  id: number = 1;
  date!: Date;
  portfolio: GamePortfolio/*  = {
    currentCash: 0,
    id: 0,
    game: new Game,
    player: new User()
  } */; // Initialize portfolio
  news: News[] = [];
  totalprofit: number = 0;
  isLoading: boolean = true; // Add loading state

  constructor(
    private gameService: GameService,
    private gameTradeService: GametradeService,
    private webSocketService: WebsocketService,
    private route: ActivatedRoute,
    private gamePortservice: GameportfolioService
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem("userIDD"));
    console.log("user", this.userId);
    this.gamePortservice.get(this.route.snapshot.params['id'],this.userId).subscribe(data => this.portfolio = data);
    this.gameService.getbyid(this.route.snapshot.params['id']).subscribe({
      next: (data: Game) => {
        this.game = data;
       // console.log('Fetched game:', data);

        // Fetch latest data and connect to WebSocket
        this.fetchLatestData(this.route.snapshot.params['id']);
        this.webSocketService.connectToLatest(
          this.route.snapshot.params['id'],
          this.game.startDate,
          this.game.endDate || new Date(),
          this.game.candlesPerDay || 0,
          this.game.simulationDays || 0
        ).subscribe(data => {
          if (data != null) {
            this.latestData = data;
            //console.log("WebSocket data:", this.latestData);
            this.updateTradesWithLatestPrice();
            this.date = this.latestData[0].datetime;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.isLoading = false; // Stop loading on error
      },
    });
  }

  fetchLatestData(id: number): void {
    this.gameService.getLatestData(id).subscribe({
      next: (data: Gamelatestdata[]) => {
        this.latestData = data;
        this.date = this.latestData[0].datetime;
        this.news = this.latestData.flatMap((data) => data.company.news);
        console.log("news", this.news);
        this.fetchGameTrades();
        //console.log('Fetched latest data:', data);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.isLoading = false; // Stop loading on error
      },
    });
  }

  fetchGameTrades(): void {
    this.gameTradeService
      .getGameTradesByUserAndGame(this.userId, this.game.id)
      .subscribe({
        next: (data) => {
          this.gameTrades = data;
          if (data.length > 0) {
            //this.portfolio = data[0].portfolio;
          }
          console.log('Fetched game trades:', data);
          this.updateTradesWithLatestPrice();
          this.isLoading = false; // Stop loading after data is fetched
        },
        error: (error) => {
          console.error('Error fetching game trades:', error);
          this.isLoading = false; // Stop loading on error
        },
      });
  }

  updateTradesWithLatestPrice(): void {
    this.gameTrades.forEach(trade => {
      const matchingLatestData = this.latestData.find(
        latest => latest.company.id === trade.company.id
      );
      if (matchingLatestData) {
        (trade as any).latestPrice = matchingLatestData.latestprice;
      }
    });
    this.totalprofit = 0;
    this.gameTrades.forEach(trade => {
      this.totalprofit = this.totalprofit + trade.latestPrice * trade.shares;
    });
    this.date = this.latestData[0].datetime;
  }

  closeTrade(trade: Gametrade, price: number): void {
    this.gameTradeService.closeTrade(trade.id, price).subscribe({
      next: (updatedTrade) => {
        const index = this.gameTrades.findIndex((t) => t.id === trade.id);
        if (index !== -1) {
          this.gameTrades[index] = updatedTrade;
        }
        alert('Trade closed successfully!');
      },
      error: (err) => {
        console.error('Error closing trade:', err);
        alert('Failed to close trade.');
      },
    });
  }
}