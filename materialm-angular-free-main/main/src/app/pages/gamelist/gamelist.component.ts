import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Game } from 'src/app/Models/Game';
import { GameService } from 'src/app/services/game.service';
import { GameportfolioService } from 'src/app/services/gameportfolio.service';

@Component({
  selector: 'app-gamelist',
  standalone: true,
  imports: [DatePipe,MatIcon,MatTableModule],
  templateUrl: './gamelist.component.html',
  styleUrl: './gamelist.component.scss'
})
export class GamelistComponent {
  games: Game[] = [];
  displayedColumns: string[] = ['id', 'name', 'startDate', 'endDate', 'actions']; // Columns to display

  constructor(private gameService: GameService,private router: Router,private gamePortservice: GameportfolioService) {}

  ngOnInit(): void {
    this.fetchGames();
  }

  fetchGames(): void {
    this.gameService.getAllGames().subscribe({
      next: (data) => {
        this.games = data;
      },
      error: (err) => {
        console.error('Error fetching games:', err);
      },
    });
  }
  viewGame(id: number): void {
    this.gamePortservice.save(id,Number(localStorage.getItem("userIDD"))).subscribe(data =>this.router.navigate(['/game/GameS', { id:id }]));
    // Navigate to the view game page with the selected game ID
    
  }

}
