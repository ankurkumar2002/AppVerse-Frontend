import { HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { User } from '../models/user';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Login } from '../models/login';
import { response } from 'express';
import { Router } from '@angular/router';
import { ErrorHandlerServiceService } from './error-handler-service.service';
import { UserResponse } from '../models/user-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8060/auth/';

  constructor(private http: HttpClient, private router:Router, private errorHandler: ErrorHandlerServiceService) { }

  private createAuthHeaders(): HttpHeaders | undefined {
    const token = localStorage.getItem('jwtToken');
    console.log('Token retrieved:', token);
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
  }

  signup(user: User): Observable<User> {
    console.log("AuthService.signup() called, making POST request..."); // <--- ADD THIS LINE
    return this.http.post<User>(this.apiUrl + 'signup', user).pipe(
        catchError((error: HttpErrorResponse) => {
            console.log("AuthService.signup() - catchError block is executing!"); // <--- KEEP THIS LOG
            // ... your error handling logic ...
            if (error.status === 500) { // Keep your existing error status check
              console.log('It is 500 error ');
              console.log(error.error.message);
                if (error.error && error.error.message) {
                    if (error.error.message.toLowerCase().includes('username already exists!')) {
                        console.log('username already exists - inside if block'); // <--- KEEP THIS LOG
                        return throwError(() => 'Username already exists. Please choose a different username.');
                    } else if (error.error.message.toLowerCase().includes('email already exists!')) {
                        console.log('email already exists - inside else if block'); // <--- KEEP THIS LOG
                        return throwError(() => 'Email already exists. Please use a different email.');
                    }
                }
            }
            return this.errorHandler.handleError(error); // Keep your generic handler
        })
    );
}

  login(loginRequest: Login): Observable<{ jwtToken: string; userDetails: any }> {
    return this.http.post<{ jwtToken: string; userDetails: any }>(this.apiUrl + 'login', loginRequest)
      .pipe(
        tap((response) => {
          if (response?.jwtToken) {
            localStorage.setItem('jwtToken', response.jwtToken);
            console.log('Token saved to localStorage:', response.jwtToken);
            // Important: do any necessary navigation after successful login here

              localStorage.setItem('userDetails', JSON.stringify(response.userDetails));


            // Crucial: Redirect to the intended route after login, and not just reload
            this.router.navigate(['/home']);
          } else {
            console.error("Invalid token response or no token found from server", response);
            // Handle the error appropriately
            throw new Error("Invalid Login Response"); // Or return an error observable
          }
        }),
        catchError((error) => {
          console.error('Error logging in:', error);
          // Important: Display error to the user.
          return throwError(() => error); // Re-throw the error for handling.
        })
      );
  }

  getToken() {
    const token = localStorage.getItem('jwtToken');
    console.log('Token retrieved:', token); 
    return token;
  }

  getAllUsers(): Observable<User[]>{
    const headers = this.createAuthHeaders();
    return this.http.get<User[]>(this.apiUrl+'users', {headers}).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  logout(){
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userDetails');
    window.location.reload();
    this.router.navigate(['/login']);
  }

  validateToken(token:string) : Observable<boolean>{
    return this.http.post<boolean>('http://localhost:8060/validate', token);
  }

  isLoggedIn(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }
    return this.validateToken(token).pipe(
      tap(isValid => {
        if (!isValid) {
          this.logout();
        }
      }),
      map(isValid => isValid),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

}
