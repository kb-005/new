import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      const status = error?.status;
      let message = 'An unexpected error occurred. Please try again.';

      if (error?.error && typeof error.error === 'object' && error.error.message) {
        message = error.error.message;
      } else if (status === 0) {
        message = 'Cannot reach the server. Check your network connection.';
      } else if (status === 400) {
        message = error?.error?.message ?? 'Invalid request. Please check the form.';
      } else if (status === 401) {
        message = 'Session expired or unauthorized. Please log in again.';
        auth.logout();
        router.navigate(['/login']);
      } else if (status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        message = error?.error?.message ?? 'The requested resource was not found.';
      } else if (status === 409) {
        message = error?.error?.message ?? 'Conflict: the record already exists or cannot be modified.';
      } else if (status === 500) {
        message = 'A server error occurred. Please try again later.';
      }

      toast.error(message);
      return throwError(() => error);
    })
  );
};
