import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyDTO } from '../Models/CompanyDTO';
import { Observable } from 'rxjs';
import { CandlestickData } from '../Models/CandlestickData';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  
  private baseUrl = 'http://localhost:8089/company/';

  constructor(private http: HttpClient) { }
  addCompany(gameId: number, companyDTO: CompanyDTO, trends: string[]): Observable<CandlestickData[]> {
    const url = `${this.baseUrl}addCompany/${gameId}`;

    let params = new HttpParams();
    trends.forEach(trend => {
      params = params.append('trends', trend);
    });

    return this.http.post<CandlestickData[]>(url, companyDTO, { params });
  }
  sendCompanyData(gameId: number,company: CompanyDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}save/${gameId}`, company);
  }
  getcurrentdata(companyId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}getdata/${companyId}`);
  }
  getbyid(companyId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}getbyid/${companyId}`);
  }
}
