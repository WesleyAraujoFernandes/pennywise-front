import { Routes } from '@angular/router';
import { DespesaFormComponent } from './components/despesa-form/despesa-form.component';
import { DespesaListComponent } from './components/despesa-list/despesa-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'despesas', pathMatch: 'full' },
  { path: 'despesas', component: DespesaListComponent },
  { path: 'despesas/novo', component: DespesaFormComponent },
  { path: 'despesas/:id/editar', component: DespesaFormComponent },
  { path: '**', redirectTo: 'despesas' } // fallback
];
