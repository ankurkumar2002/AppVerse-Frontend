import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../models/login';
import { HttpClientModule } from '@angular/common/http';
import { UserResponse } from '../../models/user-response';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule]
})
export class LoginComponent {
  loginDTO: Login = new Login('', '', false);
  userDetails: UserResponse = new UserResponse('', '', '', '', '', '');

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.loginDTO).subscribe(
      response => {
        console.log('JWT Token:', response.jwtToken);
        localStorage.setItem('jwtToken', response.jwtToken);

        // Save user information to local storage
        localStorage.setItem('userDetails', JSON.stringify(response.userDetails));

        // Print user information to the console
        console.log('User Details:', response.userDetails);

        window.location.reload();
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Login failed', error);
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
    );
  }

  
}
