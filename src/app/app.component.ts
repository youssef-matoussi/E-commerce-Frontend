import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'E-commerce'; // 
  isCartOpen: boolean = false;
  isLoginOpen: boolean = false;
  isSignupOpen: boolean = false;
  isForgotPasswordOpen: boolean = false;

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {}

  ngOnInit(): void {
    // Restore login state from localStorage (only in the browser)
    if (isPlatformBrowser(this.platformId)) {
      const accessToken = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');

      if (accessToken && user) {
        // Use public methods to update the login state
        this.authService.setLoggedIn(true);
        this.authService.setUser(JSON.parse(user));
      }
    }
  }

  onCartToggled(isOpen: boolean): void {
    this.isCartOpen = isOpen;
  }

  onCartClosed(): void {
    this.isCartOpen = false;
  }

  onLoginToggled(): void {
    this.isLoginOpen = true;
    this.isSignupOpen = false; // Close signup panel if open
    this.isForgotPasswordOpen = false; // Close forgot password panel if open
  }

  onLoginClosed(): void {
    this.isLoginOpen = false;
  }

  onSignupToggled(): void {
    this.isSignupOpen = true;
    this.isLoginOpen = false; // Close login panel if open
    this.isForgotPasswordOpen = false; // Close forgot password panel if open
  }

  onSignupClosed(): void {
    this.isSignupOpen = false;
  }

  onForgotPasswordToggled(): void {
    this.isForgotPasswordOpen = true;
    this.isLoginOpen = false; // Close login panel if open
    this.isSignupOpen = false; // Close signup panel if open
  }

  onForgotPasswordClosed(): void {
    this.isForgotPasswordOpen = false;
  }

  openLoginPanel(): void {
    this.isLoginOpen = true; // Open the login panel
  }
}