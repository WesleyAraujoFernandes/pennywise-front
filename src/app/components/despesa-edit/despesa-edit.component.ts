import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Despesa, DespesaService } from '../../services/despesa.service';

@Component({
  selector: 'app-despesa-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './despesa-edit.component.html',
  styleUrl: './despesa-edit.component.scss'
})
export class DespesaEditComponent implements OnInit {

  despesa: Despesa = { descricao: '', valor: 0, data: '', categoria: 'OUTRAS' };
  errorMessage: string | null = null;
  successMessage: string | null = null;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private service: DespesaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(this.id).subscribe({
      next: res => this.despesa = res,
      error: err => this.errorMessage = 'Erro ao carregar despesa.'
    });
  }

  submit(form: NgForm) {
    this.errorMessage = null;
    this.successMessage = null;

    if (!form.valid) {
      this.errorMessage = 'Preencha todos os campos corretamente.';
      return;
    }

    this.service.update(this.id, this.despesa).subscribe({
      next: () => {
        this.successMessage = 'Despesa atualizada com sucesso!';
        setTimeout(() => this.router.navigate(['/despesas']), 1500);
      },
      error: err => this.errorMessage = err.error?.message || 'Erro ao atualizar a despesa.'

    });
  }

}
