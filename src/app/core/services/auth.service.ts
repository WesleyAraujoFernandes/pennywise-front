import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../models/login-response-model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'pennywise_token';
  private readonly REFRESH_TOKEN_KEY = 'pennywise_refresh_token';
  private readonly USER_KEY = 'pennywise_user';
  private userSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, {
      email,
      password
    }).pipe(
      tap(response => this.setSession(response)),
      tap(() => this.router.navigate(['/dashboard']))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();

    return this.http.post<LoginResponse>(
      `${this.API_URL}/refresh`,
      { refreshToken }
    ).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify({
          email: res.email,
          role: res.role,
          refreshToken: res.refreshToken
        }));

        this.userSubject.next({
          email: res.email,
          role: res.role
        });
      })
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

  private loadUser(): AuthUser | null {
    const stored = localStorage.getItem(this.USER_KEY);

    if (!stored) {
      return null;
    }

    try {
      const parsed = JSON.parse(stored);

      if (!parsed.email || !parsed.role) {
        return null;
      }

      return {
        email: parsed.email,
        role: parsed.role
      };
    } catch {
      return null;
    }
  }


  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user).refreshToken : null;
  }

  setSession(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      email: response.email,
      role: response.role,
      refreshToken: response.refreshToken
    }));

    this.userSubject.next({
      email: response.email,
      role: response.role
    })
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
