import { HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { User } from '../models/user';
import { catchError, map, Observable, of, tap } from 'rxjs';
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

  signup(user:User): Observable<User>{
    return this.http.post<User>(this.apiUrl+'signup',user).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  login(login: Login): Observable<{ jwtToken: string, userDetails: UserResponse }> {
    return this.http.post<{ jwtToken: string, userDetails: UserResponse }>(`${this.apiUrl}login`, login).pipe(
      tap(response => {
        if (response.jwtToken) {
          localStorage.setItem('jwtToken', response.jwtToken);
          localStorage.setItem('userDetails', JSON.stringify(response.userDetails));
        }
      }),
      catchError(this.errorHandler.handleError)
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
