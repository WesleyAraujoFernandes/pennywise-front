import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../models/login-response-model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API_URL = 'http://localhost:8080/auth';
  private readonly ACCESS_TOKEN = 'pennywise_access_token';
  private readonly REFRESH_TOKEN = 'pennywise_refresh_token';
  private readonly USER_KEY = 'pennywise_user';

  private userSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<void> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        localStorage.setItem(this.ACCESS_TOKEN, response.token);
        localStorage.setItem(this.REFRESH_TOKEN, response.refreshToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify({
          email: response.email,
          role: response.role
        }));
        this.userSubject.next({
          email: response.email,
          role: response.role
        });
      }),
      tap(() => this.router.navigate(['/dashboard'])),
      map(() => void 0)
    );
  }

  logout(): void {

    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      this.http.post(
        'http://localhost:8080/auth/logout',
        { refreshToken }
      ).subscribe({
        complete: () => this.clearSession(),
        error: () => this.clearSession()
      });
    } else {
      this.clearSession();
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  getUser(): AuthUser | null {
    return this.userSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.userSubject.value;
    return !!user && user.role === role;
  }

  private loadUser(): AuthUser | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
