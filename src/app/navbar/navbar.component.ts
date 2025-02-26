import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() loginToggled = new EventEmitter<void>();
  @Output() signupToggled = new EventEmitter<void>();
  @Output() cartToggled = new EventEmitter<boolean>(); // Emit the state of the cart

  cartItemCount: number = 0;
  isLoggedIn: boolean = false; // Track login state
  user: any = null; // Store user data
  isDropdownOpen: boolean = false; // Track dropdown state

  // Define categories and subcategories
  categories = [
    {
      name: 'Women',
      subcategories: [
        {
          name: 'Nouveautés',
          subcategories: []
        },
        {
          name: 'Vêtements',
          subcategories: ['Jeans', 'Pulls', 'Manteaux', 'Blazers', 'Chemises']
        },
        {
          name: 'Chaussures',
          subcategories: ['Tennis', 'Baskets']
        },
        {
          name: 'Accessoires',
          subcategories: []
        }
      ]
    },
    {
      name: 'Men',
      subcategories: [
        {
          name: 'Nouveautés',
          subcategories: []
        },
        {
          name: 'Vêtements',
          subcategories: ['Jeans', 'Pulls', 'Manteaux', 'Blazers', 'Chemises']
        },
        {
          name: 'Chaussures',
          subcategories: ['Tennis', 'Baskets']
        },
        {
          name: 'Accessoires',
          subcategories: []
        }
      ]
    },
    {
      name: 'Shop',
      subcategories: []
    },
    {
      name: 'About',
      subcategories: []
    }
  ];

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  // Track expanded states
  expandedCategory: string | null = null;
  clickedSubcategory: string | null = null; // Track clicked subcategory
  selectedCategory: string | null = null; // Track the clicked category (e.g., "Vêtements")
  subcategoryGroups: { title: string; items: string[] }[] = [];

  ngOnInit() {
    // Subscribe to login state changes
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    // Subscribe to user data changes
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    // New logic for cart item count
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });

    this.subcategoryGroups = this.getSubcategoryGroups();
  }

  // Handle category click
  onCategoryClick(event: Event, categoryName: string) {
    event.preventDefault();
    if (this.expandedCategory === categoryName) {
      this.expandedCategory = null;
    } else {
      this.expandedCategory = categoryName;
    }
    this.clickedSubcategory = null;
  }

  // Handle subcategory click
  onSubcategoryClick(event: Event, subcategoryName: string, parentCategoryName: string) {
    event.preventDefault();
    this.selectedCategory = subcategoryName;

    if (this.clickedSubcategory === subcategoryName) {
      this.clickedSubcategory = null; // Collapse if already clicked
      this.subcategoryGroups = []; // Clear subcategories
    } else {
      this.clickedSubcategory = subcategoryName;
      this.expandedCategory = parentCategoryName; // Ensure the right category is expanded
      this.subcategoryGroups = this.getSubcategoryGroups(); // Update dynamically
    }
  }

  // Get the currently expanded category (FIXES THE ERROR)
  getCurrentCategory() {
    return (
      this.categories.find((c) => c.name === this.expandedCategory) || {
        name: '', // Add a default name
        subcategories: []
      }
    );
  }

  // Get sub-subcategory groups (e.g., TOPS, BOTTOMS)
  getSubcategoryGroups() {
    if (this.clickedSubcategory === 'Vêtements') {
      if (this.expandedCategory === 'Women') {
        return [
          { title: 'TOPS', items: ['T-Shirts', 'Sweaters', 'Blouses'] },
          { title: 'BOTTOMS', items: ['Jeans', 'Pants', 'Skirts'] },
          { title: 'DRESSES', items: ['Casual', 'Cocktail', 'Evening'] }
        ];
      }
      if (this.expandedCategory === 'Men') {
        return [
          { title: 'TOPS', items: ['Polos', 'Dress Shirts', 'Sweatshirts'] },
          { title: 'BOTTOMS', items: ['Chinos', 'Cargo Pants', 'Shorts'] },
          { title: 'OUTERWEAR', items: ['Jackets', 'Coats', 'Vests'] }
        ];
      }
    }

    if (this.clickedSubcategory === 'Chaussures') {
      if (this.expandedCategory === 'Women') {
        return [{ title: 'Chaussures', items: ['Tennis', 'Basket'] }];
      }
      if (this.expandedCategory === 'Men') {
        return [{ title: 'Chaussures', items: ['Tennis', 'Basket'] }];
      }
    }

    return [];
  }

  // Handle sub-subcategory click
  onSubSubcategoryClick(event: Event, item: string) {
    event.preventDefault();
    event.stopPropagation();

    console.log('Sub-subcategory clicked:', item); // Debugging
    console.log('Gender:', this.expandedCategory); // Debugging
    console.log('Category:', this.selectedCategory); // Debugging

    const gender = this.expandedCategory;
    const category = this.selectedCategory; // Use selectedCategory which is set by parent category
    const subcategory = item; // Use the sub-subcategory name (e.g., 'polos')

    if (gender && category) {
      this.router.navigate(['/products', gender, category, subcategory]).then((success) => {
        if (success) {
          console.log('Navigation successful:', `/products/${gender}/${category}/${subcategory}`);
        } else {
          console.error('Navigation failed!');
        }
      });
    } else {
      console.warn('Navigation prevented due to missing parameters:', { gender, category, subcategory });
    }
  }

  // Toggle the cart panel
  toggleCartPanel(event: Event): void {
    event.preventDefault();
    this.cartToggled.emit(true); // Emit an event to open the cart
  }

  // Toggle the login panel
  toggleLoginPanel(event: Event): void {
    event.preventDefault();
    this.loginToggled.emit();
  }

  // Toggle the signup panel
  toggleSignupPanel(event: Event): void {
    event.preventDefault();
    this.signupToggled.emit();
  }

  // Toggle the user dropdown
  toggleUserDropdown(event: Event): void {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Navigate to the profile page
  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.isDropdownOpen = false; // Close the dropdown
  }

  // Navigate to the orders page
  navigateToOrders(): void {
    this.router.navigate(['/orders']);
    this.isDropdownOpen = false; // Close the dropdown
  }

  // Logout the user
  logout(): void {
    this.authService.logout().subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Logout failed:', error);
      }
    );
  }

  // Handle header mouse leave
  onHeaderMouseLeave(event: MouseEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement;
    console.log('Mouse left to:', relatedTarget);

    if (!relatedTarget || !this.isPartOfNavBar(relatedTarget)) {
      this.expandedCategory = null;
      this.clickedSubcategory = null;
    }
  }

  // Helper method to check if an element is part of the navbar
  private isPartOfNavBar(element: HTMLElement): boolean {
    const header = document.querySelector('.sub-subcategories-column');
    const subcategoriesPanel = document.querySelector('.subcategories-panel');
    const subSubcategoriesPanel = document.querySelector('.sub-subcategories-column');
    return (
      header?.contains(element) ||
      subcategoriesPanel?.contains(element) ||
      subSubcategoriesPanel?.contains(element) ||
      false
    );
  }
}