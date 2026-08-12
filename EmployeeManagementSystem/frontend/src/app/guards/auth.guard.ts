import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Protects authenticated routes. Redirects unauthenticated users to /login.
 * Honors route data `{ adminOnly: true }` to restrict to Admins.
 */
export const authGuard: (route: ActivatedRouteSnapshot) => Observable<boolean | UrlTree> | boolean | UrlTree =
  (route) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    const adminOnly = route.data && route.data['adminOnly'] === true;

    if (adminOnly && !auth.isAdmin()) {
      // Authenticated but lacking rights -> dashboard.
      return router.createUrlTree(['/dashboard']);
    }

    if (auth.currentUser) {
      return true;
    }

    // Token present but cached user missing: validate token + load profile.
    return auth.fetchCurrentUser().pipe(
      map((res) => {
        if (res.success && res.data) {
          if (adminOnly && !auth.isAdmin()) {
            return router.createUrlTree(['/dashboard']);
          }
          return true;
        }
        auth.logout();
        return router.createUrlTree(['/login']);
      })
    );
  };
