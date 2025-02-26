import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @Input() isSignupOpen: boolean = false;
  @Output() signupClosed = new EventEmitter<void>();
  @Output() loginToggled = new EventEmitter<void>();

  nom: string = '';
  prenom: string = '';
  email: string = '';
  password: string = '';
  naissance: string = '';
  phone: string = '';

  // Error messages
  errors: {
    nom?: string,
    prenom?: string,
    email?: string,
    password?: string,
    naissance?: string,
    phone?: string,
    general?: string
  } = {};

  // Success state
  isSignupSuccessful: boolean = false;
  successMessage: string = '';

  constructor(private authService: AuthService) {}

  onBackToLogin(): void {
    this.loginToggled.emit(); // Emit the loginToggled event
  }

  onSignup(): void {
    // Reset errors and success state
    this.errors = {};
    this.isSignupSuccessful = false;

    // Validate form fields
    if (!this.nom) this.errors.nom = 'Nom is required';
    if (!this.prenom) this.errors.prenom = 'Prenom is required';
    if (!this.email) this.errors.email = 'Email is required';
    if (!this.password) this.errors.password = 'Password is required';
    if (!this.naissance) this.errors.naissance = 'Date de naissance is required';
    if (!this.phone) this.errors.phone = 'Phone number is required';

    // If there are errors, stop the submission
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    const userData = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      date_de_naissance: this.naissance,
      phone_number: this.phone
    };

    this.authService.register(userData).subscribe(
      (response) => {
        console.log('Signup successful:', response);
        this.isSignupSuccessful = true; // Set success state to true
        this.successMessage = 'Signup successful. Please check your email to verify your account.';
      },
      (error) => {
        console.error('Signup failed:', error);
        if (error.error && error.error.error === 'Cette adresse e-mail existe déjà') {
          this.errors.email = '⚠ This email already exists';
        } else if (error.error && error.error.error === 'Ce numéro de téléphone existe déjà') {
          this.errors.phone = '⚠ This phone number already exists';
        } else if (error.error && error.error.error === 'All fields are required') {
          this.errors.general = 'All fields are required';
        } else {
          this.errors.general = '⚠ Signup failed. Please try again.';
        }
      }
    );
  }
}