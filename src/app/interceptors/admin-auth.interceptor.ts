import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AdminAuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const isProtectedApiCall = isAdminProtectedRequest(req.url, req.method);

  const authReq = token && isProtectedApiCall
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && isProtectedApiCall) {
        authService.logout();
        sessionStorage.setItem('admin_session_expired', '1');
        router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    })
  );
};

function isAdminProtectedRequest(url: string, method: string): boolean {
  const adminApiBaseUrl = `${environment.apiBaseUrl}/admin`;
  const isAdminApiCall = url.startsWith(adminApiBaseUrl) || url.includes('/api/admin');
  const isLoginRequest = url.endsWith('/admin/login');

  // Envia bearer para toda rota administrativa, exceto login.
  return isAdminApiCall && !isLoginRequest;
}
