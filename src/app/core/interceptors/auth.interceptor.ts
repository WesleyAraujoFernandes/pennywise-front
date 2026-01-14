import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { ToastService } from "../../services/toast.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
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

        if (error.status === 401) {
          this.toast.error('Sessão expirada. Faça login novamente.');
          this.authService.logout();
        }

        if (error.status === 403) {
          this.toast.warning('Você não tem permissão para acessar este recurso.');
          this.router.navigate(['/dashboard']);
        }

        return throwError(() => error);
      })
    );
  }
}
