import { Routes } from '@angular/router';
import { DespesaListComponent } from './components/despesa-list/despesa-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EntradaListComponent } from './components/entrada-list/entrada-list.component';
import { LoginComponent } from './components/login/login.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { DespesaFormComponent } from './components/despesa-form/despesa-form.component';
import { EntradaFormComponent } from './components/entrada-form/entrada-form.component';
import { SessionExpiredComponent } from './components/session-expired/session-expired.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'session-expired', component: SessionExpiredComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'despesas',
        component: DespesaListComponent,
        data: { roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'despesas/novo',
        component: DespesaFormComponent,
        data: { roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'despesas/:id/editar',
        component: DespesaFormComponent,
        data: { roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'entradas',
        component: EntradaListComponent,
        data: { roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'entradas/novo',
        component: EntradaFormComponent,
        data: { roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'entradas/:id/editar',
        component: EntradaFormComponent,
        data: { roles: ['ROLE_ADMIN'] }
      },
      { path: 'unauthorized', component: UnauthorizedComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
