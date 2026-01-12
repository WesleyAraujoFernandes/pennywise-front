import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Despesa, DespesaService } from '../../services/despesa.service';
import { CATEGORIA_LABEL } from '../../shared/categoria-label';
import { Router, RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-despesa-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, RouterLink, RouterModule],
  templateUrl: './despesa-list.component.html',
  styleUrl: './despesa-list.component.scss'
})
export class DespesaListComponent implements OnInit {
  despesas: Despesa[] = [];

  constructor(private service: DespesaService, private router: Router) { }

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
}
