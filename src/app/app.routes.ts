import { Routes } from '@angular/router';
import { DespesaFormComponent } from './components/despesa-form/despesa-form.component';
import { DespesaListComponent } from './components/despesa-list/despesa-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EntradaListComponent } from './components/entrada-list/entrada-list.component';
import { EntradaFormComponent } from './components/entrada-form/entrada-form.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'entradas', component: EntradaListComponent },
  { path: 'despesas', component: DespesaListComponent },
  { path: 'despesas/novo', component: DespesaFormComponent },
  { path: 'entradas/novo', component: EntradaFormComponent },
  { path: 'despesas/:id/editar', component: DespesaFormComponent },
  { path: 'entradas/:id/editar', component: EntradaFormComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } // fallback
];
