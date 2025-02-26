import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../services/cart.service';

interface ProductSize {
  name: string;
  value: number;
  disabled: boolean;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;
  gender: string = '';
  category: string = '';
  subcategory: string = '';
  reference: string = '';
  availableSizes: ProductSize[] = [];
  color: string = '';
  selectedSize: string | null = null;
  showSizeError: boolean = false; // Add this property

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService // Inject CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.gender = params['gender'];
      this.category = params['category'];
      this.subcategory = params['subcategory'];
      this.reference = params['reference'];
      this.fetchProductDetails();
    });
  }

  fetchProductDetails() {
    const encodedReference = encodeURIComponent(this.reference);
    const url = `http://localhost:3000/api/products/${this.gender}/${this.category}/${this.subcategory}/${encodedReference}`;

    this.http.get<any>(url).subscribe(
      (product) => {
        if (product && product.length > 0) {
          this.product = product[0];
          this.availableSizes = [
            { name: 'XS', value: this.product.sizeXS, disabled: this.product.sizeXS === 0 },
            { name: 'S', value: this.product.sizeS, disabled: this.product.sizeS === 0 },
            { name: 'M', value: this.product.sizeM, disabled: this.product.sizeM === 0 },
            { name: 'L', value: this.product.sizeL, disabled: this.product.sizeL === 0 },
            { name: 'XL', value: this.product.sizeXL, disabled: this.product.sizeXL === 0 },
            { name: 'XXL', value: this.product.sizeXXL, disabled: this.product.sizeXXL === 0 }
          ];
          this.color = this.product.color;
        } else {
          console.error('No product found.');
        }
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  selectSize(size: string) {
    if (!this.availableSizes.find(s => s.name === size)?.disabled) {
      this.selectedSize = size;
    }
  }

  // Add the product to the cart
  addToCart(): void {
    if (!this.selectedSize) {
      this.showSizeError = true; // Show error message
      return;
    }

    this.showSizeError = false; // Hide error message
    this.cartService.addToCart(this.product, this.selectedSize);
  }
}