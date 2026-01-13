import { Component, OnInit } from '@angular/core';
import { Entrada, EntradaService } from '../../services/entrada.service';
import { CATEGORIA_LABEL } from '../../shared/categoria-label';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-entrada-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, RouterModule],
  templateUrl: './entrada-list.component.html',
  styleUrl: './entrada-list.component.scss'
})
export class EntradaListComponent implements OnInit {
  entradas: Entrada[] = [];
  dataInicio?: string;
  dataFim?: string;
  constructor(private router: Router, private service: EntradaService, private toast: ToastService) { }

  ngOnInit(): void {
    this.load();
  }

  categoriaLabel(value: string): string {
    return CATEGORIA_LABEL[value] ?? value;
  }

  load() {
    this.service.getAll().subscribe(res => this.entradas = res);
  }
  edit(entrada: Entrada) {
    this.router.navigate(['/entradas', entrada.id, 'editar']);
  }
  delete(id: number) {
    if (confirm('Deseja realmente excluir esta entrada?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }

  buscar() {
    if (this.dataInicio && this.dataFim && this.dataInicio > this.dataFim) {
      this.toast.error('Data inicial não pode ser maior que a data final');
      return;
    }
    this.service.buscarPorPeriodo(this.dataInicio, this.dataFim).subscribe(res => this.entradas = res);
  }

  limpar() {
    this.dataInicio = undefined;
    this.dataFim = undefined;
    this.buscar();
  }
}
