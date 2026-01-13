import { Component, OnInit } from '@angular/core';
import { Entrada, EntradaService } from '../../services/entrada.service';
import { CATEGORIA_LABEL } from '../../shared/categoria-label';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrada-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, RouterModule],
  templateUrl: './entrada-list.component.html',
  styleUrl: './entrada-list.component.scss'
})
export class EntradaListComponent implements OnInit {
  entradas: Entrada[] = [];
  constructor(private router: Router, private service: EntradaService) { }

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
}
