import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Correct import

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if a token exists in localStorage
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    console.error("No token found in localStorage. Navigating to login");
    router.navigate(['/login']);
    return of(false);
  }

  return authService.validateToken(token).pipe(
    map((isValid) => {
      if (isValid) {
        console.log("Token is valid. Allowing access.");
        return true;
      } else {
        console.error("Token is invalid. Redirecting to login.");
        localStorage.removeItem('jwtToken'); // Crucial!
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError((error) => {
      console.error('Error validating token', error);
      localStorage.removeItem('jwtToken'); // Crucial!
      router.navigate(['/login']);
      return of(false);
    })
  );
};