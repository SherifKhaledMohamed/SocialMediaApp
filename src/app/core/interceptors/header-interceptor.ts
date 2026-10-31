import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  if (localStorage.getItem('token')) {
    req = req.clone({
      setHeaders: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': `application/json`,
      },
    });
  }

  return next(req);
};
