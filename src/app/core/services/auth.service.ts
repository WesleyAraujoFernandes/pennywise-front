import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../models/login-response-model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API_URL = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'pennywise_token';
  private readonly REFRESH_TOKEN_KEY = 'pennywise_refresh';
  private readonly USER_KEY = 'pennywise_user';

  private userSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser(): AuthUser | null {
    return this.userSubject.value;
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/refresh`, {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap(response => this.storeSession(response))
    );
  }

  storeSession(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      email: response.email,
      role: response.role
    }));

    this.userSubject.next({
      email: response.email,
      role: response.role
    });
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      this.http.post(`${this.API_URL}/logout`, { refreshToken })
        .subscribe({
          complete: () => this.clearSession(),
          error: () => this.clearSession()
        });
    } else {
      this.clearSession();
    }
  }

  public clearSession(): void {
    localStorage.clear();
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private loadUser(): AuthUser | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'ROLE_ADMIN';
  }

  isUser(): boolean {
    return this.userSubject.value?.role === 'ROLE_USER';
  }

  hasRole(role: string): boolean {
    return this.userSubject.value?.role === role;
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, {
      email,
      password
    }).pipe(
      tap(response => this.storeSession(response)),
      tap(() => this.router.navigate(['/dashboard'])),
      map(() => void 0),
      catchError(err => {
        const message =
          err?.error?.message || 'Não foi possível realizar o login';

        return throwError(() => new Error(message));
      })
    );
  }


}

