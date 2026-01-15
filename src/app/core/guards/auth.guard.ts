import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Não autenticado → login
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Verificar roles da rota
  const allowedRoles: string[] = route.data?.['roles'];

  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // rota sem restrição de role
  }

  const user = authService.getUser();

  if (!user || !allowedRoles.includes(user.role)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
