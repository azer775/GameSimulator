import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { A } from '@angular/cdk/keycodes';
import { Addtest2Component } from './pages/addtest2/addtest2.component';
import { GameformComponent } from './pages/gameform/gameform.component';
import { ShowcomapnyComponent } from './pages/showcomapny/showcomapny.component';
import { ShowgameComponent } from './pages/showgame/showgame.component';
import { LoginazerComponent } from './pages/loginazer/loginazer.component';
import { Game } from './Models/Game';
import { GamelistComponent } from './pages/gamelist/gamelist.component';
import { MygamelistComponent } from './pages/mygamelist/mygamelist.component';

export const routes: Routes=[
  {path: 'game', component: FullComponent,
    children: [
      {path:"gameC", component:GameformComponent},
      {path:"CompanyC", component:Addtest2Component},
      {path:"CompanyS", component:ShowcomapnyComponent},
      {path:"GameS", component:ShowgameComponent},
      {path:"add", component:GameformComponent},
      {path:"all", component:GamelistComponent},
      {path:"my", component:MygamelistComponent}
    ]
  },
  {path: 'logina', component: LoginazerComponent

  }
] /*= [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];*/
