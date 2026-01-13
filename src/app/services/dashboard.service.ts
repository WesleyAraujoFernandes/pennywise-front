import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DashboardResumo {
  totalEntradas: number;
  totalDespesas: number;
  saldo: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8080/api/dashboard/resumo';

  constructor(private http: HttpClient) { }

  getResumo(): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(this.apiUrl);
  }
}
