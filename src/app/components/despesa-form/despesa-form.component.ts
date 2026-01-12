import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Despesa, DespesaService } from '../../services/despesa.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormErrorService } from '../../services/form-error.service';
import { ToastService } from '../../services/toast.service';

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
  isSubmitting = false;

  despesa: Despesa = {} as Despesa;
  isEdit = false;

  constructor(private service: DespesaService, public formError: FormErrorService, private toast: ToastService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;

      this.service.getById(+id).subscribe({
        next: res => {
          this.despesa = {
            ...res,
            data: res.data ? res.data.substring(0, 10) : ''
          };
        },
        error: () => {
          this.toast.error('Erro ao carregar despesa');
          this.router.navigate(['/despesas']);
        }
      });
    }
  }

  submit(form: NgForm) {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    if (!form.valid) {
      this.formError.markAllAsTouched(form);
      this.isSubmitting = false;
      return;
    }

    const action = this.isEdit
      ? this.service.update(this.despesa.id!, this.despesa)
      : this.service.create(this.despesa);

    action.subscribe({
      next: () => {
        this.toast.success(
          this.isEdit
            ? 'Despesa atualizada com sucesso!'
            : 'Despesa criada com sucesso!'
        );
        this.router.navigate(['/despesas']);
      },
      error: err => {
        this.isSubmitting = false;
        this.toast.error('Erro ao salvar despesa');
        this.formError.applyBackendErrors(form, err.error);
      }
    });
  }

}
