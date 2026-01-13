import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Despesa {
  id?: number;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class DespesaService {
  private apiUrl = 'http://localhost:8080/api/despesas';
  constructor(private http: HttpClient) { }

  getAll(): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(this.apiUrl);
  }

  getById(id: number): Observable<Despesa> {
    return this.http.get<Despesa>(`${this.apiUrl}/${id}`);
  }

  create(despesa: Despesa): Observable<Despesa> {
    return this.http.post<Despesa>(this.apiUrl, despesa);
  }

  update(id: number, despesa: Despesa): Observable<Despesa> {
    return this.http.put<Despesa>(`${this.apiUrl}/${id}`, despesa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarPorPeriodo(dataInicio?: string, dataFim?: string): Observable<Despesa[]> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim) params = params.set('dataFim', dataFim);
    console.log(params.get('dataInicio'));
    console.log(params.get('dataFim'));
    return this.http.get<Despesa[]>(this.apiUrl + "/periodo", { params });
  }

}
