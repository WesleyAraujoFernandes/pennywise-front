import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { delay, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'pnnywise_token'

  constructor(private router: Router) { }

  login(email: string, senha: string): Observable<void> {
    if (email === 'admin@pennywise.com' && senha === '123456') {
      localStorage.setItem(this.STORAGE_KEY, 'fake-jwt-token');
      return of(void 0);
    }
    return throwError(() => new Error('Credenciais inválidas'));
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }
}
