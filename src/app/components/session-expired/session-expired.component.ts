import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-expired',
  standalone: true,
  imports: [],
  templateUrl: './session-expired.component.html',
  styleUrl: './session-expired.component.scss'
})
export class SessionExpiredComponent {
  constructor(private router: Router) { }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
