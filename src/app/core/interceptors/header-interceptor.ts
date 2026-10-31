import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const isFormData = req.body instanceof FormData;

    req = req.clone({
      setHeaders: {
        AUTHORIZATION: `Bearer ${token}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
    });
  }

  return next(req);
};
