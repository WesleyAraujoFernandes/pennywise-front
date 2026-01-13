import { Component, OnInit } from '@angular/core';
import { DashboardResumo, DashboardService } from '../../services/dashboard.service';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  resumo?: DashboardResumo;

  constructor(private service: DashboardService) { }


  ngOnInit(): void {
    this.service.getResumo().subscribe(res => this.resumo = res);
  }
}
