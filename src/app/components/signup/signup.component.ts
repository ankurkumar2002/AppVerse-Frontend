import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

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
    if (this.signupForm.valid) {
      const user = { ...this.signupForm.value, role: 'USER' }; 
      this.authService.signup(user).subscribe(
        response => {
          console.log('User signed up successfully:', response);
          this.successMessage = 'Signup successful!';
          this.errorMessage = null;
        },
        error => {
          console.error('Signup failed', error);
          this.errorMessage = 'Signup failed. Please try again.';
          this.successMessage = null;
        }
      );
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}
