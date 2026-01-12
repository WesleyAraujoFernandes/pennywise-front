import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Despesa, DespesaService } from '../../services/despesa.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-despesa-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './despesa-form.component.html',
  styleUrl: './despesa-form.component.scss'
})
export class DespesaFormComponent {

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private service: DespesaService, private router: Router) { }

  submit(form: NgForm) {
    this.errorMessage = null;
    this.successMessage = null;

    if (!form.valid) {
      this.errorMessage = 'Preencha todos os campos corretamente.';
      return;
    }

    const novaDespesa: Despesa = form.value;

    this.service.create(novaDespesa).subscribe({
      next: () => {
        this.successMessage = 'Despesa criada com sucesso!'
        form.resetForm();
        setTimeout(() => this.router.navigate(['/despesas']), 1500);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Erro ao criar despesa';
      }
    })
  }
}
