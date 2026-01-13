import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(data: LoginRequest): Observable<void> {
    // Mock temporário
    return of(void 0).pipe(delay(1000));
  }
}
