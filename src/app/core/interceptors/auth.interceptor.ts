import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const authHeader = auth.getAuthHeader();

  const authReq = authHeader
    ? req.clone({ setHeaders: { Authorization: authHeader } })
    : req;

  return next(authReq);
};
