import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from '../Models/Game';
import { Observable } from 'rxjs';
import { GameDTO } from '../Models/GameDTO';
import { Gamelatestdata } from '../Models/Gamelatestdata';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private baseUrl = 'http://localhost:8089/games/';
  
    constructor(private http: HttpClient) { }
    createGame(game: GameDTO): Observable<Game> {
      return this.http.post<Game>(`${this.baseUrl}create`, game);
    }
    getuser(username:string): Observable<User> {
      return this.http.get<User>(`${this.baseUrl}getu/${username}`);
    }
    calculateVirtualTime(
      startDate: Date,
      currentTime: Date,
      endDate: Date,
      virtualStartDate: Date,
      simulationDays: number
    ): Date {
      const elapsedRealTimeInSeconds =
        (currentTime.getTime() - new Date(startDate).getTime()) / 1000;
  
      const totalRealTimeInSeconds =
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / 1000;
  
      const virtualSecondsPerRealSecond =
        (simulationDays * 24 * 60 * 60) / totalRealTimeInSeconds;
  
      const elapsedVirtualSeconds =
        elapsedRealTimeInSeconds * virtualSecondsPerRealSecond;
  
      const elapsedVirtualTime = elapsedVirtualSeconds * 1000; // Convert to milliseconds
      const virtualTime = new Date(
        new Date(virtualStartDate).getTime() + elapsedVirtualTime
      );
  
      return virtualTime;
    }
    getLatestData(id: number): Observable<Gamelatestdata[]> {
      return this.http.get<Gamelatestdata[]>(`${this.baseUrl}getlatestdata/${id}`);
    }
    getbyid(id: number): Observable<Game> {
      return this.http.get<Game>(`${this.baseUrl}byid/${id}`);
    }
}
