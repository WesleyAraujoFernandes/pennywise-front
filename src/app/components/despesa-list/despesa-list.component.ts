import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Despesa, DespesaService } from '../../services/despesa.service';

@Component({
  selector: 'app-despesa-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './despesa-list.component.html',
  styleUrl: './despesa-list.component.scss'
})
export class DespesaListComponent implements OnInit {
  despesas: Despesa[] = [];

  constructor(private service: DespesaService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(res => this.despesas = res);
  }

  edit(despesa: Despesa) {
    console.log('Editar', despesa);
    // Navegar para formulário com Router ou abrir modal
  }

  delete(id?: number) {
    if (!id) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
