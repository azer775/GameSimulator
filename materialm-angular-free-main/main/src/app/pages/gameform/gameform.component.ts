import { A } from '@angular/cdk/keycodes';
import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgxEchartsDirective, NgxEchartsModule } from 'ngx-echarts';
import { Game } from 'src/app/Models/Game';
import { GameDTO } from 'src/app/Models/GameDTO';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-gameform',
  standalone: true,
  imports: [ NgIf, NgxEchartsModule,
    MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatCheckboxModule,],
  templateUrl: './gameform.component.html',
  styleUrl: './gameform.component.scss'
})
export class GameformComponent implements OnInit{
  
  gameForm: FormGroup;

  constructor(
    private fb: FormBuilder, // Inject FormBuilder
    private gameService: GameService,private router: Router
  ) {}
  
  ngOnInit(): void {
    this.gameForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Add validators for form fields
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      virtualStartDate: ['', Validators.required],
      simulationDays: [0, [Validators.required, Validators.min(1)]],
      candlesPerDay: [0, [Validators.required, Validators.min(1)]],
      startingAmount: [0, [Validators.required, Validators.min(1)]],
      allowstoploss: [false],
      allowtakeprofit: [false],
      allowshortpos: [false],
      allowlongpos: [false],
    },{ validators: this.atLeastOnePositionValidator });
  }
  atLeastOnePositionValidator(control: AbstractControl): ValidationErrors | null {
    const allowshortpos = control.get('allowshortpos')?.value;
    const allowlongpos = control.get('allowlongpos')?.value;
    return allowshortpos || allowlongpos ? null : { atLeastOnePosition: true };
  }
  createGame() {
    if (this.gameForm.valid) {
      const game: GameDTO = this.gameForm.value; // Get the form values
      this.gameService.createGame(game).subscribe(
        (response) => {
          console.log('game sent', game);
          console.log('Game created successfully', response);
          this.router.navigate(['/game/CompanyC', { id: JSON.stringify(response.id) }]);
        },
        (error) => {
          console.log('game', game);
          console.error('Error creating game', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
