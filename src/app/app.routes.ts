import { Routes } from '@angular/router';
import { DespesaFormComponent } from './components/despesa-form/despesa-form.component';
import { DespesaListComponent } from './components/despesa-list/despesa-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'despesas', component: DespesaListComponent },
  { path: 'despesas/novo', component: DespesaFormComponent },
  { path: 'despesas/:id/editar', component: DespesaFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'despesas', pathMatch: 'full' },
  { path: '**', redirectTo: 'despesas' } // fallback
];
