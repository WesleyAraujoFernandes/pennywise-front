import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, switchMap, tap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { ToastService } from "../../services/toast.service";
import { LoginResponse } from "../models/login-response-model";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private toast: ToastService // seu serviço de toast
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = this.authService.getToken();

    const authRequest = token
      ? request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
      : request;

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.authService.getRefreshToken()) {
          return this.http.post<LoginResponse>(
            'http://localhost:8080/auth/refresh',
            { refreshToken: this.authService.getRefreshToken() }
          ).pipe(
            tap(res => {
              localStorage.setItem('pennywise_access_token', res.accessToken);
            }),
            switchMap(() => {
              const newRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.authService.getToken()}`
                }
              });
              return next.handle(newRequest);
            }),
            catchError(() => {
              this.authService.logout();
              return throwError(() => error);
            })
          );
        }

        if (error.status === 403) {
          this.toast.warning('Você não tem permissão para esta ação.');
          this.router.navigate(['/unauthorized']);
        }

        return throwError(() => error);
      })
    );
  }
}
