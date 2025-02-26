import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService, CartItem } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  @Input() isCartOpen: boolean = false;
  @Output() cartClosed = new EventEmitter<void>();
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  // Calculate the total price
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  // Update the quantity of an item in the cart
  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      quantity = 1; // Ensure quantity is at least 1
    }
    this.cartService.updateQuantity(item, quantity);
  }
}