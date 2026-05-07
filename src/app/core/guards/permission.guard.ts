import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/models/auth.service';

export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredPermission = route.data?.['permission'];

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (!requiredPermission) {
    return true;
  }

  if (authService.hasPermission(requiredPermission)) {
    return true;
  }

  if (authService.hasPermission('DASHBOARD_VIEW')) {
    router.navigate(['/dashboard']);
  } else if (authService.hasPermission('POS_ACCESS')) {
    router.navigate(['/orders']);
  } else if (authService.hasPermission('ORDER_VIEW')) {
    router.navigate(['/orders-history']);
  } else {
    router.navigate(['/login']);
  }

  return false;
};