import { Routes } from '@angular/router';
import { DespesaFormComponent } from './components/despesa-form/despesa-form.component';
import { DespesaListComponent } from './components/despesa-list/despesa-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EntradaListComponent } from './components/entrada-list/entrada-list.component';
import { EntradaFormComponent } from './components/entrada-form/entrada-form.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'despesas', component: DespesaListComponent },
      { path: 'entradas', component: EntradaListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  /*
  { path: 'login', component: LoginComponent },
  { path: 'despesas/novo', component: DespesaFormComponent, canActivate: [authGuard] },
  { path: 'entradas/novo', component: EntradaFormComponent, canActivate: [authGuard] },
  { path: 'despesas/:id/editar', component: DespesaFormComponent, canActivate: [authGuard] },
  { path: 'entradas/:id/editar', component: EntradaFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' } // fallback
   */
];
