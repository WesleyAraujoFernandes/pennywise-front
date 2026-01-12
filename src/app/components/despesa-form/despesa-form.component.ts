import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Despesa, DespesaService } from '../../services/despesa.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-despesa-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './despesa-form.component.html',
  styleUrl: './despesa-form.component.scss'
})
export class DespesaFormComponent implements OnInit {

  errorMessage: string | null = null;
  successMessage: string | null = null;

  despesa: Despesa = {} as Despesa;
  isEdit = false;

  constructor(private service: DespesaService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('DespesaFormComponent carregado');

    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID da rota:', id);

    if (id) {
      this.isEdit = true;

      this.service.getById(+id).subscribe({
        next: res => {
          this.despesa = {
            ...res,
            data: res.data ? res.data.substring(0, 10) : ''
          };
        },
        error: () => alert(`Erro ao carregar despesa: ${id}`)
      });
    }
  }


  submit(form: NgForm) {
    this.errorMessage = null;
    this.successMessage = null;

    if (!form.valid) {
      this.errorMessage = 'Ocorreu um erro na validação do formulário';
      return;
    }
    const action = this.isEdit ? this.service.update(this.despesa.id!, this.despesa) : this.service.create(this.despesa);
    action.subscribe({
      next: () => this.router.navigate(['/despesas']),
      error: err => alert(err.error?.message || 'Erro ao salvar despesa')
    });
  }
}
