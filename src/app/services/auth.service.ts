import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private apiUrl = 'http://192.168.0.100:3000/api'; // Replace with your backend API URL
  // private apiUrl = 'https://e-commerce-backend-a46t.onrender.com/api'; // Replace with your backend API URL
  private apiUrl = environment.apiUrl;


  // BehaviorSubject to track login state and user data
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userSubject = new BehaviorSubject<any>(this.getUser());

  // Observable to expose login state and user data
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {}

  // Check if the user has a token in localStorage (only in the browser)
  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  }

  // Get user data from localStorage (only in the browser)
  private getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Register a new user
  register(userData: {
    nom: string,
    prenom: string,
    email: string,
    password: string,
    date_de_naissance: string,
    phone_number: string
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Login a user
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Store the access token and user data in localStorage (only in the browser)
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        // Update login state and user data
        this.setLoggedIn(true);
        this.setUser(response.user);
      })
    );
  }

  // Verify user email
  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify/${token}`);
  }

  // Forgot password
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  // Verify reset code
  verifyResetCode(data: { email: string, resetCode: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code`, data);
  }

  // Reset password
  resetPassword(data: { email: string, newPassword: string, confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  // Logout the user
  logout(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        // Clear the access token and user data from localStorage (only in the browser)
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }

        // Update login state and user data
        this.setLoggedIn(false);
        this.setUser(null);
      })
    );
  }

  // Get the current user data
  getCurrentUser(): any {
    return this.userSubject.value;
  }

  // Public method to set the login state
  setLoggedIn(isLoggedIn: boolean): void {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  // Public method to set the user data
  setUser(user: any): void {
    this.userSubject.next(user);
  }
}