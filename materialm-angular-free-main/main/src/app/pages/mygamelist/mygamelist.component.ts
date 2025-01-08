import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Game } from 'src/app/Models/Game';
import { GameService } from 'src/app/services/game.service';
import { GameportfolioService } from 'src/app/services/gameportfolio.service';

@Component({
  selector: 'app-mygamelist',
  standalone: true,
  imports: [DatePipe,MatIcon,MatTableModule],
  templateUrl: './mygamelist.component.html',
  styleUrl: './mygamelist.component.scss'
})
export class MygamelistComponent {
  games: Game[] = [];
    displayedColumns: string[] = ['id', 'name', 'startDate', 'endDate', 'actions']; // Columns to display
  
    constructor(private gameService: GameService,private router: Router,private gamePortservice: GameportfolioService) {}
  
    ngOnInit(): void {
      this.fetchGames();
    }
  
    fetchGames(): void {
      this.gamePortservice.getgame(Number(localStorage.getItem("userIDD"))).subscribe({
        next: (data) => {
          this.games = data;
        },
        error: (err) => {
          console.error('Error fetching games:', err);
        },
      });
    }
    viewGame(id: number): void {
      this.router.navigate(['/game/GameS', { id:id }]);
      // Navigate to the view game page with the selected game ID
      
    }

}
