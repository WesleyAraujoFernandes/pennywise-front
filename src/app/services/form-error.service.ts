import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormErrorService {

  /**
   * Marca todos os campos como touched
   */
  markAllAsTouched(form: NgForm): void {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  /**
   * Aplica erros vindos do backend campo a campo
   */
  applyBackendErrors(
    form: NgForm,
    errors: Record<string, string>
  ): void {
    if (!errors) return;

    Object.keys(errors).forEach(field => {
      const control = form.controls[field];
      if (control) {
        control.setErrors({
          serverError: errors[field]
        });
        control.markAsTouched();
      }
    });
  }

  /**
   * Retorna a mensagem de erro de um campo
   */
  getErrorMessage(
    form: NgForm,
    field: string
  ): string | null {
    const control = form.controls[field];
    if (!control || !control.errors || !control.touched) return null;

    if (control.errors['serverError']) {
      return control.errors['serverError'];
    }

    if (control.errors['required']) return 'Campo obrigatório';
    if (control.errors['min']) return 'Valor abaixo do permitido';
    if (control.errors['max']) return 'Valor acima do permitido';

    return 'Campo inválido';
  }
}
