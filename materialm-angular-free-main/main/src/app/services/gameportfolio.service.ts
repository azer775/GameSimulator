import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GamePortfolioDTO } from '../Models/GamePortfolioDTO';
import { Observable } from 'rxjs';
import { GamePortfolio } from '../Models/GamePortfolio';

@Injectable({
  providedIn: 'root'
})
export class GameportfolioService {

   private baseUrl = 'http://localhost:8089/gameportfolio/';
    
      constructor(private http: HttpClient) { }
      create(dto:GamePortfolioDTO) :Observable<GamePortfolio>{
        console.log(dto)
        return this.http.post<GamePortfolio>(`${this.baseUrl}sav`, dto);
      }
      get(idg:number,idu:number): Observable<GamePortfolio> {
        return this.http.get<GamePortfolio>(`${this.baseUrl}getport/${idg}/${idu}`);
      }
}
