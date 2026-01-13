import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Entrada, EntradaService } from '../../services/entrada.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormErrorService } from '../../services/form-error.service';
import { ToastService } from '../../services/toast.service';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-entrada-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxCurrencyDirective],
  templateUrl: './entrada-form.component.html',
  styleUrl: './entrada-form.component.scss'
})
export class EntradaFormComponent implements OnInit {
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;
  currencyOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    precision: 2,
    allowNegative: false
  }

  entrada: Entrada = {} as Entrada;
  isEdit = false;

  constructor(private service: EntradaService, public formError: FormErrorService, private toast: ToastService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;

      this.service.getById(+id).subscribe({
        next: res => {
          this.entrada = {
            ...res,
            data: res.data ? res.data.substring(0, 10) : ''
          };
        },
        error: () => {
          this.toast.error('Erro ao carregar entradas');
          this.router.navigate(['/entradas']);
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
      ? this.service.update(this.entrada.id!, this.entrada)
      : this.service.create(this.entrada);

    action.subscribe({
      next: () => {
        this.toast.success(
          this.isEdit
            ? 'Entrada atualizada com sucesso!'
            : 'Entrada criada com sucesso!'
        );
        this.router.navigate(['/entradas']);
      },
      error: err => {
        this.isSubmitting = false;
        this.toast.error('Erro ao salvar entrada');
        this.formError.applyBackendErrors(form, err.error);
      }
    });
  }

}
