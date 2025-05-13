import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  const authHeader = auth.getAuthHeader();
  if (authHeader) {
    req = req.clone({
      headers: req.headers.set('Authorization', authHeader)
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        auth.clearCredentials();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
