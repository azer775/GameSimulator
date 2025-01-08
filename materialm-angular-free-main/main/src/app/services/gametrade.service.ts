import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GametradeDTO } from '../Models/GametradeDTO';
import { Gametrade } from '../Models/GameTrade';

@Injectable({
  providedIn: 'root'
})
export class GametradeService {

  private baseUrl = 'http://localhost:8089/gametrade'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  addGameTrade(dto: GametradeDTO): Observable<Gametrade> {
    return this.http.post<Gametrade>(`${this.baseUrl}/add`, dto);
  }
  getGameTradesByUserAndGame(idu: number, idg: number): Observable<Gametrade[]> {
    return this.http.get<Gametrade[]>(`${this.baseUrl}/getport/${idu}/${idg}`);
  }
  closeTrade(id: number, price: number): Observable<Gametrade> {
    return this.http.put<Gametrade>(`${this.baseUrl}/close/${id}/${price}`, {});
  }
  

}
