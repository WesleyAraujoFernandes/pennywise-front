import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Entrada {
  id?: number;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  private apiUrl = 'http://localhost:8080/api/entradas';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.apiUrl);
  }

  getById(id: number): Observable<Entrada> {
    return this.http.get<Entrada>(`${this.apiUrl}/${id}`);
  }

  create(entrada: Entrada): Observable<Entrada> {
    return this.http.post<Entrada>(this.apiUrl, entrada);
  }

  update(id: number, entrada: Entrada): Observable<Entrada> {
    return this.http.put<Entrada>(`${this.apiUrl}/${id}`, entrada);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

