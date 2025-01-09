import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Game } from 'src/app/Models/Game';
import { GamePortfolio } from 'src/app/Models/GamePortfolio';
import { GameportfolioService } from 'src/app/services/gameportfolio.service';
import { GametradeService } from 'src/app/services/gametrade.service';

@Component({
  selector: 'app-addtrade',
  standalone: true,
  imports: [MatFormFieldModule,
            ReactiveFormsModule,
            MatSelectModule,
            MatButtonModule,
            MatSelectModule,
            MatOptionModule,
            NgIf,
            MatLabel,MatInput,
            CurrencyPipe],
  templateUrl: './addtrade.component.html',
  styleUrl: './addtrade.component.scss'
})
export class AddtradeComponent implements OnInit {
  gameport: GamePortfolio;
  tradeForm: FormGroup;
public positions = ['LONG', 'SHORT']; // Dropdown options for position
 public states = ['OPEN', 'CLOSED'];
 maxGain: number | null = null;
 maxLoss: number | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string ,id: number, price: number,game:Game}, // Access the passed data
    private dialogRef: MatDialogRef<AddtradeComponent>, // Reference to the dialog
    private GameportfolioService: GameportfolioService,
    private fb: FormBuilder,
  private gametradeService: GametradeService,
  private snackBar: MatSnackBar,
  private router: Router) {
      this.tradeForm = this.fb.group({
        position: ['', Validators.required],
        shares: [null, [Validators.required, Validators.min(1)]],
        price: [data.price, [Validators.required, Validators.min(0.01)]],
        takeProfit: [null],
        stopLoss: [null]
      });
    }
  ngOnInit(): void {
    
    this.GameportfolioService.get(this.data.game.id,Number(localStorage.getItem("userIDD"))).subscribe(data => {
      this.gameport = data;
    });
    //this.tradeForm.get('price')?.disable();
  }

  closePopup(): void {
    this.dialogRef.close(); // Close the dialog programmatically
  }
  calculateMaxGainAndLoss(): void {
    const formValues = this.tradeForm.value;
    const position = formValues.position;
    const shares = formValues.shares || 0;
    const price = this.data.price;
    const stopLoss = formValues.stopLoss;
    const takeProfit = formValues.takeProfit;

    if (position && shares > 0 && price > 0) {
      if (position === 'LONG') {
        if (takeProfit) {
          this.maxGain = (takeProfit - price) * shares;
        } else {
          this.maxGain = null;
        }
        if (stopLoss) {
          this.maxLoss = (price - stopLoss) * shares;
        } else {
          this.maxLoss = null;
        }
      } else if (position === 'SHORT') {
        if (takeProfit) {
          this.maxGain = (price - takeProfit) * shares;
        } else {
          this.maxGain = null;
        }
        if (stopLoss) {
          this.maxLoss = (stopLoss - price) * shares;
        } else {
          this.maxLoss = null;
        }
      }
    } else {
      this.maxGain = null;
      this.maxLoss = null;
    }
  }
  
  submitTrade(): void {
    if (this.tradeForm) {
      const gameTradeDTO = this.tradeForm.value;
      gameTradeDTO.company = this.data.id;
      gameTradeDTO.portfolio = this.gameport.id;
      gameTradeDTO.state = 'OPEN';
      this.gametradeService.addGameTrade(gameTradeDTO).subscribe((response) => {
        console.log('Trade added successfully:', response);
        this.snackBar.open('Trade added successfully!', 'Close', {
          duration: 3000, // Message duration in milliseconds
          horizontalPosition: 'right', // Position of the snackbar
          verticalPosition: 'top', // Position of the snackbar
          panelClass: ['success-snackbar'], // Optional: Add custom CSS class
        });
        this.closePopup();
        this.router.navigate(['/game/GameS', { id: this.gameport.game.id }]);
        }, (error) => {
        console.log('Error adding trade:', gameTradeDTO);
        console.error('Error adding trade:', error);
      });
    }
  }

}
