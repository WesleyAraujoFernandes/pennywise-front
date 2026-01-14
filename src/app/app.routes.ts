import { Routes } from '@angular/router';
import { DespesaFormComponent } from './components/despesa-form/despesa-form.component';
import { DespesaListComponent } from './components/despesa-list/despesa-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EntradaListComponent } from './components/entrada-list/entrada-list.component';
import { EntradaFormComponent } from './components/entrada-form/entrada-form.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'entradas', component: EntradaListComponent, canActivate: [authGuard] },
  { path: 'despesas', component: DespesaListComponent, canActivate: [authGuard] },
  { path: 'despesas/novo', component: DespesaFormComponent, canActivate: [authGuard] },
  { path: 'entradas/novo', component: EntradaFormComponent, canActivate: [authGuard] },
  { path: 'despesas/:id/editar', component: DespesaFormComponent, canActivate: [authGuard] },
  { path: 'entradas/:id/editar', component: EntradaFormComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } // fallback
];
