import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GameDTO } from 'src/app/Models/GameDTO';
import { GamePortfolioDTO } from 'src/app/Models/GamePortfolioDTO';
import { GameportfolioService } from 'src/app/services/gameportfolio.service';

@Component({
  selector: 'app-signtogame',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signtogame.component.html',
  styleUrl: './signtogame.component.scss'
})
export class SigntogameComponent implements OnInit{
  userid: number =1;
  form: FormGroup;
  constructor(private service:GameportfolioService, private fb:FormBuilder){
    
  }

  ngOnInit(): void {
    this.userid=Number(localStorage.getItem("userIDD"));
    this.form = this.fb.group(
      {gamecode:['']}
    )
  }
  OnSubmit(){
    if(this.form.valid){
      const game: GamePortfolioDTO=this.form.value;
      game.player=this.userid;
      console.log(game)
      this.service.create(game).subscribe((response)=>{
        console.log("portfolio",response);
        alert("signin successful");
      },
      (error)=>{
        console.log("error creating portfolio",error);
      })
    }
  }

}
