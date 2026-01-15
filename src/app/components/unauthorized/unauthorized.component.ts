import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {
  constructor(private router: Router) { }

  goToDashboard(): void {
    this.router.navigate(['/dashboard'])
  }

  logout(): void {
    this.router.navigate(['/login'])
  }
}
