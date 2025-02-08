import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const loggedinGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('jwtToken');

  if (token) {
    return authService.validateToken(token).pipe(
      map((isValid: boolean) => {
        if (isValid) {
          router.navigate(['/home']);
          return false;
        } else {
          return true;
        }
      }),
      catchError((error) => {
        console.error('Error validating token', error);
        return of(true);
      })
    );
  } else {
    return of(true);
  }
};