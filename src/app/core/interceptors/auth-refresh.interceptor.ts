import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, catchError, throwError, filter, take, switchMap } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthRefreshInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = this.authService.getToken();

    const authReq = token
      ? request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
      : request;

    return next.handle(authReq).pipe(
      catchError(err => {

        if (err.status !== 401) {
          return throwError(() => err);
        }

        if (this.isRefreshing) {
          return this.refreshSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token =>
              next.handle(this.addToken(request, token!))
            )
          );
        }

        this.isRefreshing = true;
        this.refreshSubject.next(null);

        return this.authService.refreshToken().pipe(
          switchMap(res => {
            this.isRefreshing = false;
            this.refreshSubject.next(res.accessToken);
            return next.handle(this.addToken(request, res.accessToken));
          }),
          catchError(() => {
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(() => err);
          })
        );
      })
    );
  }

  private addToken(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
}
