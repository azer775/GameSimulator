import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { User } from 'src/app/Models/User';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-loginazer',
  standalone: true,
  imports: [RouterModule,
            MaterialModule,
            FormsModule,
            ReactiveFormsModule,
            MatButtonModule],
  templateUrl: './loginazer.component.html',
  styleUrl: './loginazer.component.scss'
})
export class LoginazerComponent {
  user!:string;
  constructor(private gameservice:GameService){

  }

  login(username: string): void {
    this.user = username;
    this.gameservice.getuser(this.user).subscribe(data =>{ 
      console.log(data)
      localStorage.setItem('userIDD', data.id.toString());
      console.log("user local",localStorage.getItem('userIDD'));
    }
      
  );
  }

}
