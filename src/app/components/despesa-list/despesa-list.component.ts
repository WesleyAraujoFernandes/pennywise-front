import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Despesa, DespesaService } from '../../services/despesa.service';
import { CATEGORIA_LABEL } from '../../shared/categoria-label';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-despesa-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, RouterModule],
  templateUrl: './despesa-list.component.html',
  styleUrl: './despesa-list.component.scss'
})
export class DespesaListComponent implements OnInit {
  despesas: Despesa[] = [];
  dataInicio?: string;
  dataFim?: string;

  constructor(private service: DespesaService, private router: Router, private toast: ToastService) { }

  ngOnInit(): void {
    this.load();
  }

  categoriaLabel(value: string): string {
    return CATEGORIA_LABEL[value] ?? value;
  }

  load() {
    this.service.getAll().subscribe(res => this.despesas = res);
  }

  edit(despesa: Despesa) {
    console.log('Editar', despesa);
    this.router.navigate(['/despesas', despesa.id, 'editar']);
  }

  delete(id: number) {
    if (!confirm('Deseja realmente excluir esta despesa?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }

  buscar() {
    if (this.dataInicio && this.dataFim && this.dataInicio > this.dataFim) {
      this.toast.error('Data inicial não pode ser maior que a data final');
      return;
    }
    console.log("buscar dataInicio:" + this.dataInicio);
    this.service.buscarPorPeriodo(this.dataInicio, this.dataFim).subscribe(res => this.despesas = res);
  }

  limpar() {
    this.dataInicio = undefined;
    this.dataFim = undefined;
    this.buscar();
  }

}
