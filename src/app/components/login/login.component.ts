import { Component } from '@angular/core';
import { LoginRequest } from '../../core/models/login-request.model';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  senha = '';
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  submit(form: NgForm) {
    this.errorMessage = null;

    if (this.isSubmitting || !form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.isSubmitting = false;
        this.errorMessage = err.message;
      }
    })
  }
}
