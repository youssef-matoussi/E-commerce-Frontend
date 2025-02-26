import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  product: any;
  size: string;
  quantity: number;
  reference: string; // Add this line
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Load cart items from local storage only in the browser
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems.next(JSON.parse(savedCart));
      }
    }
  }

  addToCart(product: any, size: string): void {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(item => item.product.reference === product.reference && item.size === size);
  
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentItems.push({ product, size, quantity: 1, reference: product.reference }); // Add reference here
    }
  
    this.cartItems.next(currentItems);
    this.saveCartToLocalStorage();
  }

  removeFromCart(item: CartItem): void {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(cartItem => cartItem !== item);
    this.cartItems.next(updatedItems);
    this.saveCartToLocalStorage();
  }

  updateQuantity(item: CartItem, quantity: number): void {
    const currentItems = this.cartItems.getValue();
    const updatedItem = currentItems.find(cartItem => cartItem === item);

    if (updatedItem) {
      updatedItem.quantity = quantity;
      this.cartItems.next(currentItems);
      this.saveCartToLocalStorage();
    }
  }

  private saveCartToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems.getValue()));
    }
  }
}