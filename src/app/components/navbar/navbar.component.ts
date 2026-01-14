import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  //showNavbar = true;
  /*

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showNavbar = !this.router.url.startsWith('/login');
      })
  }
      */
  constructor(private auth: AuthService) { }

  logout() {
    this.auth.logout();
  }
}
