import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DespesaService } from '../../services/despesa.service';

@Component({
  selector: 'app-despesa-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './despesa-form.component.html',
  styleUrl: './despesa-form.component.scss'
})
export class DespesaFormComponent {
  constructor(private service: DespesaService) { }

  submit(form: NgForm) {
    if (!form.valid) return;

    this.service.create(form.value).subscribe({
      next: res => {
        alert('Despesa criada com sucesso!');
      },
      error: err => {
        alert(err.error?.message || 'Erro ao criar despesa');
      }
    })
  }
}
