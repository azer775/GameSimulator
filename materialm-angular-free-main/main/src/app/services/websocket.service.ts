import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, switchMap } from 'rxjs';
import SockJS from 'sockjs-client';
import {Client, over } from 'stompjs';
import { Stomp } from '@stomp/stompjs';
import { CandlestickData } from '../Models/CandlestickData';
import { CompanyService } from './company.service';
import { Gametrade } from '../Models/GameTrade';
import { GametradeService } from './gametrade.service';
import { Gamelatestdata } from '../Models/Gamelatestdata';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  
  
      private stompClient: any;
      private candlestickUpdates = new BehaviorSubject<CandlestickData[]>([]);
      private companyId: number = 4; // Assuming companyId is 4 for example
      mockData!: CandlestickData[];
      candlestickUpdates$: Observable<CandlestickData[]> = this.candlestickUpdates.asObservable();
      private gameTradeUpdates = new BehaviorSubject<Gametrade[]>([]);
      private mockData1!: Gametrade[];  // Mock data for GameTrade
      gameTradeUpdates$: Observable<Gametrade[]> = this.gameTradeUpdates.asObservable();
      // Timer interval in milliseconds (e.g. 10 seconds)
      private timerInterval = 1000;
      private gameDataUpdates = new BehaviorSubject<Gamelatestdata[] | null>(null);
      gameDataUpdates$: Observable<Gamelatestdata[] | null> = this.gameDataUpdates.asObservable();
      private mockData2!: Gamelatestdata[];
      private timeInterval: number = 1000;

      constructor(private companyservice: CompanyService,private tradeservice: GametradeService,private gameService: GameService){}


      connect(companyId: number): Observable<CandlestickData[]> {
        this.companyId = companyId;
        const socket = new SockJS('http://localhost:8089/api/gamedata');
        this.stompClient = Stomp.over(socket);
    
        this.stompClient.connect({}, (frame: any) => {
          console.log('Connected to WebSocket');
          // Start a timer to periodically fetch the candlestick data
          interval(this.timerInterval).pipe(
            switchMap(() => this.fetchCandlestickData())
          ).subscribe(data => {
            this.candlestickUpdates.next(data);
          });
        }, (error: any) => {
          console.error('WebSocket connection error:', error);
          this.reconnect(companyId);
        });
    
        return this.candlestickUpdates$;
      }
    
      private fetchCandlestickData(): Observable<CandlestickData[]> {
        // Replace this with actual HTTP service to fetch data from server
        return new Observable<CandlestickData[]>((observer) => {
          // Simulating a server response (you can replace this with an HTTP call)
           this.companyservice.getcurrentdata(this.companyId).subscribe(data => {
            this.mockData = data;
          });
          console.log(this.mockData);
          observer.next(this.mockData);
          observer.complete();
        });
      }
    
      private reconnect(companyId: number): void {
        console.log('Reconnecting...');
        setTimeout(() => {
          this.connect(companyId);
        }, 5000); // Try reconnecting after 5 seconds
      }
      
      connect1(companyId: number): Observable<any> {
        this.companyId = companyId;
        const socket = new SockJS('http://localhost:8089/api/gamedata'); // Update WebSocket endpoint
    
        this.stompClient = Stomp.over(socket);
    
        this.stompClient.connect({}, (frame: any) => {
          console.log('Connected to WebSocket');
          // Subscribe to the candlestick topic for this company
          this.stompClient.subscribe(`/topic/candlesticks/${this.companyId}`, (message: any) => {
            if (message.body) {
              const data = JSON.parse(message.body);
              this.candlestickUpdates.next(data);
            }
          });
    
          // Start a timer to periodically fetch candlestick data
          interval(this.timerInterval).pipe(
            switchMap(() => this.fetchCandlestickData())
          ).subscribe(data => {
            this.candlestickUpdates.next(data);
          });
    
        }, (error: any) => {
          console.error('WebSocket connection error:', error);
          this.reconnect(companyId);
        });
    
        return this.candlestickUpdates$;
      }
      connect2(idu: number, idg: number): Observable<any> {
        const socket = new SockJS('http://localhost:8089/api/gamedata'); // WebSocket URL
    
        this.stompClient = Stomp.over(socket);
    
        
        this.stompClient.connect({}, (frame: any) => {
          console.log('Connected to WebSocket');
          // Subscribe to the topic for GameTrade updates
          this.stompClient.subscribe(`/topic/gamedata/${idu}/${idg}`, (message: any) => {
            if (message.body) {
              const data: Gametrade[] = JSON.parse(message.body);
              this.gameTradeUpdates.next(data);  // Push data to the BehaviorSubject
            }
          });
    
          // Start a timer to periodically fetch GameTrade data
          interval(this.timerInterval).pipe(
            switchMap(() => this.fetchGameTradeData(idu, idg))
          ).subscribe(data => {
            this.gameTradeUpdates.next(data);  // Emit new data
          });
    
        }, (error: any) => {
          console.error('WebSocket connection error:', error);
          this.reconnect1(idu, idg);  // Reconnect on error
        });
    
        return this.candlestickUpdates$;
      }
      private reconnect1(companyId: number,idg: number): void {
        console.log('Reconnecting...');
        setTimeout(() => {
          this.connect2(companyId,idg);
        }, 5000); // Try reconnecting after 5 seconds
      }
      private fetchGameTradeData(idu: number, idg: number): Observable<Gametrade[]> {
        return new Observable<Gametrade[]>((observer) => {
          // Simulating an HTTP response (replace with actual API call)
          this.tradeservice.getGameTradesByUserAndGame(idu, idg).subscribe(data => {
            this.mockData1 = data;  // Assuming the data is in the form of GameTrade[]
          });
          console.log(this.mockData1);
          observer.next(this.mockData1);
          observer.complete();
        });
      }
      private fetchGameLatestData(): Observable<Gamelatestdata[]> {
        return new Observable<Gamelatestdata[]>((observer) => {
          // Simulating an HTTP response (replace with actual API call)
          this.gameService.getLatestData(this.companyId).subscribe(data => {
            this.mockData2 = data;
          });
         // console.log("latest:",this.mockData2);
          observer.next(this.mockData2);
          observer.complete();
        });
      }
      private reconnectTolatest(companyId: number,startDate: Date,endDate: Date,candlesPerDay: number,simulationDays: number): void {
        console.log('Reconnecting...');
        setTimeout(() => {
          this.connectToLatest(companyId,startDate,endDate,candlesPerDay,simulationDays);
        }, 5000); // Try reconnecting after 5 seconds
      }
      connectToLatest(companyId: number,startDate: Date,endDate: Date,candlesPerDay: number,simulationDays: number): Observable<Gamelatestdata[] | null> {
        this.companyId = companyId;
        const socket = new SockJS('http://localhost:8089/api/gamedata');  // WebSocket URL for latest data
        this.timeInterval = this.getRealMicrosecondsBetweenCandlesticks(startDate, endDate, candlesPerDay, simulationDays);
        this.stompClient = Stomp.over(socket);
        console.log("timer:"+this.timeInterval);
        this.stompClient.connect({}, (frame: any) => {
          console.log('Connected to WebSocket');
          // Subscribe to the topic for game latest data updates
          this.stompClient.subscribe(`/topic/gamecomp/${this.companyId}`, (message: any) => {
            if (message.body) {
              const data: Gamelatestdata[] = JSON.parse(message.body);
              this.gameDataUpdates.next(data);  // Push data to the BehaviorSubject
            }
          });
    
          // Start a timer to periodically fetch the latest game data
          interval(this.timeInterval as number).pipe(
            switchMap(() => this.fetchGameLatestData())
          ).subscribe(data => {
            this.gameDataUpdates.next(data);  // Emit new data
            console.log('Fetched latest data:', data);
          });
    
        }, (error: any) => {
          console.error('WebSocket connection error:', error);
          this.reconnectTolatest(companyId,startDate,endDate,candlesPerDay,simulationDays);  // Reconnect on error
        });
    
        return this.gameDataUpdates$;  // Return the observable to listen for updates
      }
       getRealMicrosecondsBetweenCandlesticks(
        startDate: Date,
        endDate: Date,
        candlesPerDay: number,
        simulationDays: number
      ): number {
        
        // Calculate total real time duration in microseconds
        const totalRealTimeInMicroseconds =
          (new Date(endDate).getTime() - new Date(startDate).getTime()) ; // Convert milliseconds to microseconds
          
        // Calculate total number of candlesticks
        const totalCandlesticks = candlesPerDay * simulationDays;
        
        // Calculate real microseconds between each candlestick
        const microsecondsBetweenCandlesticks = totalRealTimeInMicroseconds / totalCandlesticks;
        console.log('Real microseconds between candlesticks:', microsecondsBetweenCandlesticks);

        return microsecondsBetweenCandlesticks;
      }
}
