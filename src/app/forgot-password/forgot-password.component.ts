import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnChanges {
  @Input() isForgotPasswordOpen: boolean = false;
  @Output() forgotPasswordClosed = new EventEmitter<void>();
  @Output() loginToggled = new EventEmitter<void>();
  @Output() openLoginPanel = new EventEmitter<void>();

  email: string = '';
  resetCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  step: number = 1; // Track the current step (1: Email, 2: Reset Code, 3: New Password)
  isLoading: boolean = false;
  showError: boolean = false;
  showSuccess: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isForgotPasswordOpen'] && !changes['isForgotPasswordOpen'].currentValue) {
      this.resetForm(); // Clear inputs and reset state when the panel is closed
    }
  }

  onBackToLogin(): void {
    this.resetForm(); // Clear inputs and reset state
    this.loginToggled.emit(); // Emit the loginToggled event
  }

  onSubmit(): void {
    this.isLoading = true;

    if (this.step === 1) {
      // Step 1: Send reset code
      this.authService.forgotPassword(this.email).subscribe(
        (response) => {
          this.isLoading = false;
          this.showSuccess = true;
          this.successMessage = 'Reset code sent to your email.';
          setTimeout(() => {
            this.showSuccess = false;
          }, 3000);
          this.step = 2; // Move to Step 2
        },
        (error) => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = error.error?.error || '⚠ Failed to send reset code. Please try again.';
          setTimeout(() => {
            this.showError = false;
          }, 3000);
        }
      );
    } else if (this.step === 2) {
      // Step 2: Verify reset code
      this.authService.verifyResetCode({ email: this.email, resetCode: this.resetCode }).subscribe(
        (response) => {
          this.isLoading = false;
          this.showSuccess = true;
          this.successMessage = 'Reset code verified. You can now reset your password.';
          setTimeout(() => {
            this.showSuccess = false;
          }, 3000);
          this.step = 3; // Move to Step 3
        },
        (error) => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = error.error?.error || '⚠ Invalid or expired reset code.';
          setTimeout(() => {
            this.showError = false;
          }, 3000);
        }
      );
    } else if (this.step === 3) {
      // Step 3: Reset password
      this.authService.resetPassword({ email: this.email, newPassword: this.newPassword, confirmPassword: this.confirmPassword }).subscribe(
        (response) => {
          this.isLoading = false;
          this.showSuccess = true;
          this.successMessage = 'Password reset successfully. You can now log in.';
          setTimeout(() => {
            this.showSuccess = false;
            this.forgotPasswordClosed.emit(); // Close the forgot password panel
            this.openLoginPanel.emit(); // Open the login panel
          }, 3000);
        },
        (error) => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = error.error?.error || '⚠ Failed to reset password. Please try again.';
          setTimeout(() => {
            this.showError = false;
          }, 3000);
        }
      );
    }
  }

  resetForm(): void {
    this.email = '';
    this.resetCode = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.step = 1; // Reset to Step 1
    this.isLoading = false;
    this.showError = false;
    this.showSuccess = false;
    this.errorMessage = '';
    this.successMessage = '';
  }
}