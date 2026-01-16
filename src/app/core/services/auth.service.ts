import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../models/login-response-model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'pennywise_token';
  private readonly REFRESH_TOKEN_KEY = 'pennywise_refresh_token';
  private readonly USER_KEY = 'pennywise_user';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, {
      email,
      password
    }).pipe(
      tap(response => this.storeAuthData(response)),
      tap(() => this.router.navigate(['/dashboard']))
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      this.http.post(`${this.API_URL}/logout`, { refreshToken }).subscribe();
    }

    localStorage.clear();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();

    return this.http.post<LoginResponse>(`${this.API_URL}/refresh`, {
      refreshToken
    }).pipe(
      tap(response => this.storeAuthData(response))
    );
  }

  private storeAuthData(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      email: response.email,
      role: response.role
    }));
  }

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
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return !!user && user.role === role;
  }

  isAdmin(): boolean {
    const user = this.getUser()
    return !!user && user.role === 'ROLE_ADMIN';
  }

  isUser(): boolean {
    const user = this.getUser();
    return !!user && user.role === 'ROLE_USER';
  }
}
