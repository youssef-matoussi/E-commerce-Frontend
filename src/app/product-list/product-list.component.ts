import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  gender: string = '';
  category: string = '';
  subcategory: string = '';
  reference: string = '';
  currentImageIndex: { [key: string]: number } = {}; // Track image index for each product
  gridColumns: number = 4;  // Default to 4 columns
  gridStyle: any = {};  // Store the dynamic grid style

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router // Inject the Router
  ) {}

  ngOnInit() {
    // Listen for route parameters changes
    this.route.params.subscribe(params => {
      this.gender = params['gender'];
      this.category = params['category'];
      this.subcategory = params['subcategory'];
      this.reference = params['reference'];
      console.log('Loaded parameters:', { gender: this.gender, category: this.category, subcategory: this.subcategory });

      console.log('Fetching products for:', this.gender, this.category, this.subcategory); // Debugging
      this.fetchProducts();  // Fetch products whenever the params change
    });
  }

  fetchProducts() {
    // const url = `http://localhost:3000/api/products/${this.gender}/${this.category}/${this.subcategory}`;
    // const url = `https://e-commerce-backend-a46t.onrender.com/api/products/${this.gender}/${this.category}/${this.subcategory}`;
    const url = `${environment.apiUrl}/api/products/${this.gender}/${this.category}/${this.subcategory}`;
    
    this.http.get<any[]>(url).subscribe(
      (products) => {
        // Map through products to handle imageUrl array and initialize currentImageIndex
        this.products = products.map(product => {
          const imageUrls = typeof product.imageUrl === 'string' ? JSON.parse(product.imageUrl) : product.imageUrl;
          this.currentImageIndex[product.id] = 0; // Initialize to show the first image by default
          return { ...product, imageUrl: imageUrls };
        });
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Function to handle navigation to product details
  viewProductDetails(reference: string) {
    // Navigate to the ProductDetails component
    this.router.navigate([`/products/${this.gender}/${this.category}/${this.subcategory}/${reference}`]);
  }

  // Functions to navigate images
  prevImage(product: any): void {
    if (this.currentImageIndex[product.id] > 0) {
      this.currentImageIndex[product.id]--;
    } else {
      this.currentImageIndex[product.id] = product.imageUrl.length - 1; // Loop to last image
    }
  }

  nextImage(product: any): void {
    if (this.currentImageIndex[product.id] < product.imageUrl.length - 1) {
      this.currentImageIndex[product.id]++;
    } else {
      this.currentImageIndex[product.id] = 0; // Loop to first image
    }
  }

  updateGridLayout(columns: number) {
    this.gridColumns = columns;
    this.updateGridStyle();  // Update grid style when the layout changes
  }

  updateGridStyle() {
    this.gridStyle = {
      'grid-template-columns': `repeat(${this.gridColumns}, 1fr)`  // Dynamically set the number of columns
    };
  }
}
