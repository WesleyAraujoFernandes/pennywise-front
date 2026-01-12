import { Component } from '@angular/core';
import { Entrada, EntradaService } from '../../services/entrada.service';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DespesaService } from '../../services/despesa.service';

@Component({
  selector: 'app-entrada-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, RouterModule],
  templateUrl: './entrada-list.component.html',
  styleUrl: './entrada-list.component.scss'
})
export class EntradaListComponent {
  entradas: Entrada[] = [];
  constructor(private router: Router, private service: EntradaService) { }
  load() {
    this.service.getAll().subscribe(res => this.entradas = res);
  }
  edit(entrada: Entrada) {
    this.router.navigate(['/entradas', entrada.id, 'editar']);
  }
  delete(id: number) {
    if (confirm('Deseja realmente excluir esta despesa?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }

}
