import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, tap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { ToastService } from "../../services/toast.service";
import { LoginResponse } from "../models/login-response-model";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private readonly publicEndpoints = [
    '/auth/login',
    '/auth/refresh',
    '/auth/logout'
  ]
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (this.publicEndpoints.some(url => request.url.includes(url))) {
      return next.handle(request);
    }

    const token = this.authService.getToken();

    if (!token) {
      return next.handle(request);
    }

    const authRequest = token
      ? request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
      : request;

    return next.handle(authRequest).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.handle401Error(authRequest, next);
        }

        if (error.status === 403) {
          this.router.navigate(['/unauthorized']);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap(response => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.accessToken);

          return next.handle(
            request.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`
              }
            })
          );
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token =>
        next.handle(
          request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          })
        )
      )
    );
  }
}
