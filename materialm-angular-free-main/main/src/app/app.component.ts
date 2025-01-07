import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlankComponent } from "./layouts/blank/blank.component";
import { FullComponent } from "./layouts/full/full.component";
import { AppChipsComponent } from "./pages/ui-components/chips/chips.component";
import { AppFormsComponent } from "./pages/ui-components/forms/forms.component";
import { StarterComponent } from "./pages/starter/starter.component";
import { AppSamplePageComponent } from "./pages/extra/sample-page/sample-page.component";
import { Addtest2Component } from "./pages/addtest2/addtest2.component";
import { ShowcomapnyComponent } from "./pages/showcomapny/showcomapny.component";
import { GameformComponent } from "./pages/gameform/gameform.component";
import { SigntogameComponent } from "./pages/signtogame/signtogame.component";
import { GameclockComponent } from "./pages/gameclock/gameclock.component";
import { ShowgameComponent } from "./pages/showgame/showgame.component";
import { AddtradeComponent } from "./pages/addtrade/addtrade.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BlankComponent, FullComponent, AppChipsComponent, AppFormsComponent, StarterComponent, AppSamplePageComponent, Addtest2Component, ShowcomapnyComponent, GameformComponent, SigntogameComponent, GameclockComponent, ShowgameComponent, AddtradeComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Modernize Angular Admin Tempplate';
}
