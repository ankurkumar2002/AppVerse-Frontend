import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('jwtToken');

  if (token) {
    return authService.validateToken(token).pipe(
      map((isValid: boolean) => {
        if (isValid) {
          return true;
        } else {
          router.navigate(['/login']);
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error validating token', error);
        router.navigate(['/login']);
        return of(false);

        
      })
    );
  } else {
    router.navigate(['/login']);
    return of(false);
  }
};