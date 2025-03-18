import { Component, OnInit } from '@angular/core'; // Import OnInit
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; // Import ReactiveFormsModule, FormGroup, FormControl, Validators
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
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, ReactiveFormsModule] // Add ReactiveFormsModule to imports
})
export class LoginComponent implements OnInit { // Implement OnInit
  loginDTO: Login = new Login('', '', false);
  userDetails: UserResponse = new UserResponse('', '', '', '', '', '');

  errorMessage: string | null = null;
  loginForm: FormGroup; // Define FormGroup

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({ // Initialize FormGroup in constructor or ngOnInit
      username: new FormControl('', [Validators.required]), // Add Validators.required for username
      password: new FormControl('', [Validators.required, Validators.minLength(6)]), // Add Validators.required and minLength for password
      rememberMe: new FormControl(false) // rememberMe control
    });
  }

  ngOnInit(): void {
    // FormGroup initialization can also be done here
  }


  login() {
    if (this.loginForm.valid) { // Check if the form is valid before proceeding
      this.loginDTO = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value,
        rememberMe: this.loginForm.get('rememberMe')?.value
      };

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
    } else {
      // Form is invalid, display error messages (handled in template)
      console.log("Form is invalid");
    }
  }
}