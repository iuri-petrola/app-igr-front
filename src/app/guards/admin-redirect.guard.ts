import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminRedirectGuard: CanActivateFn = () => {
  const authService = inject(AdminAuthService);
  const router = inject(Router);

  // Acessando /admin, envia para login sem sessao e para a area interna com sessao valida.
  return authService.isLoggedIn()
    ? router.createUrlTree(['/admin/midias'])
    : router.createUrlTree(['/admin/login']);
};
