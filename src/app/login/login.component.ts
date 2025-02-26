import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Input() isLoginOpen: boolean = false;
  @Output() loginClosed = new EventEmitter<void>();
  @Output() signupToggled = new EventEmitter<void>();
  @Output() forgotPasswordToggled = new EventEmitter<void>();

  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  showError: boolean = false; // Control error message visibility
  showSuccess: boolean = false; // Control success message visibility
  errorMessage: string = ''; // Store the error message dynamically

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.isLoading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe(
      (response) => {
        this.isLoading = false;
        console.log('Login successful', response);

        // Show success message
        this.showSuccess = true;

        // Hide the success message after 3 seconds
        setTimeout(() => {
          this.showSuccess = false;

          // Close the login panel
          this.loginClosed.emit();

          // Store the access token and redirect
          localStorage.setItem('accessToken', response.accessToken);
          this.router.navigate(['/home']);
        }, 3000);
      },
      (error) => {
        this.isLoading = false;
        console.error('Login failed', error);

        // Handle specific error messages
        if (error.status === 403 && error.error?.error === 'Please verify your email before logging in') {
          // Show unverified account error message
          this.showError = true;
          this.errorMessage = '⚠ Please verify your account before you try to login';
        } else if (error.status === 400 && error.error?.error === 'Invalid credentials') {
          // Show invalid credentials error message
          this.showError = true;
          this.errorMessage = '⚠ Please verify your Email or password, something wrong';
        } else {
          // Show a generic error message for other errors
          this.showError = true;
          this.errorMessage = '⚠ An unexpected error occurred. Please try again later.';
        }

        // Hide the error message after 3 seconds
        setTimeout(() => {
          this.showError = false;
        }, 3000);
      }
    );
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.forgotPasswordToggled.emit();
  }

  onSignupLinkClick(event: Event): void {
    event.preventDefault();
    this.signupToggled.emit();
  }
}