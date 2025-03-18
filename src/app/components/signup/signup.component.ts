import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class SignupComponent implements OnInit {
  signupForm: any;

  successMessage: string | null = null;
  // Specific error variables
  emailExistsError: string | null = null;
  usernameExistsError: string | null = null;
  serverError: string | null = null;
  validationError: string | null = null; // For client-side form validation
  genericErrorMessage: string | null = null; // For other errors
  errorMessage: string | null = null; // This errorMessage is not needed, you can remove it

  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      first_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  signup() {
    this.resetErrorMessages(); // Clear previous errors on each signup attempt

    if (this.signupForm.valid) {
      const user = { ...this.signupForm.value, role: 'USER' };
      this.authService.signup(user).subscribe({
        next: (response) => {
          console.log('User signed up successfully:', response);
          this.successMessage = 'Signup successful!';
          this.resetForm(); // Call resetForm to clear the form after successful signup
          this.router.navigate(['/login'])
        },
        error: (errorMessage) => { // errorMessage is now the string from AuthService
          console.error('Signup failed', errorMessage);
          if (errorMessage.includes('Email already exists')) {
            this.emailExistsError = errorMessage;
          } else if (errorMessage.includes('Username already exists')) {
            this.usernameExistsError = errorMessage;
          } else if (errorMessage.includes('Internal Server Error')) {
            this.serverError = errorMessage;
          } else {
            this.genericErrorMessage = errorMessage || 'Signup failed. Please try again.'; // Generic fallback
          }
          this.successMessage = null;
        }
      });
    } else {
      this.validationError = 'Please fill out the form correctly.'; // Set validation error for client-side issues
    }
  }

  // Helper function to reset specific error messages
  private resetErrorMessages() {
    this.genericErrorMessage = null;
    this.emailExistsError = null;
    this.usernameExistsError = null;
    this.serverError = null;
    this.validationError = null;
    this.successMessage = null; // Also clear success message on new attempt
  }

  // Helper function to reset the form
  private resetForm() {
    this.signupForm.reset();
  }
}