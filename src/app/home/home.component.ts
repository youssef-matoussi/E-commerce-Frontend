import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { Router } from '@angular/router'; // Import Router


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}


  // Track expanded states
  expandedCategory: string | null = null;
  clickedSubcategory: string | null = null; // Track clicked subcategory
  selectedCategory: string | null = null; // Track the clicked category (e.g., "Vêtements")
  subcategoryGroups: { title: string; items: string[] }[] = [];


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
    return this.categories.find(c => c.name === this.expandedCategory) || { 
      name: '', // Add a default name
      subcategories: [] 
    };
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
        return [
          { title: 'Chaussures', items: ['Tennis', 'Basket'] }
        ];
      }
      if (this.expandedCategory === 'Men') {
        return [
          { title: 'Chaussures', items: ['Tennis', 'Basket'] }

        ];
      }
    }
    
    return [];
  }

  ngOnInit() {
    this.subcategoryGroups = this.getSubcategoryGroups();
  }


  onHeaderMouseLeave(event: MouseEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement;
    console.log("Mouse left to:", relatedTarget);
  
    if (!relatedTarget || !this.isPartOfNavBar(relatedTarget)) {
      this.expandedCategory = null;
      this.clickedSubcategory = null;
    }
  }
  

  // Handle sub-subcategory click
  // home.component.ts
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
      this.router.navigate(['/products', gender, category, subcategory]).then(success => {
        if (success) {
          console.log('Navigation successful:', `/products/${gender}/${category}/${subcategory}`);
        } else {
          console.error('Navigation failed!');
        }
      }).catch(err => console.error('Navigation error:', err));
    } else {
      console.warn('Navigation prevented due to missing parameters:', { gender, category, subcategory });
    }
  }
  
  
  
  
  // Helper method to check if an element is a descendant of the header
  private isDescendantOfHeader(element: HTMLElement): boolean {
    const header = document.querySelector('header');
    return header?.contains(element) || false;
  }

  private isPartOfNavBar(element: HTMLElement): boolean {
    const header = document.querySelector('.sub-subcategories-column');
    const subcategoriesPanel = document.querySelector('.subcategories-panel');
    const subSubcategoriesPanel = document.querySelector('.sub-subcategories-column');
    return (
      header?.contains(element) || 
      subcategoriesPanel?.contains(element) ||
      subSubcategoriesPanel?.contains(element) || false
    );
  }


  private swiper!: Swiper;  // Use non-null assertion to tell TypeScript the swiper will be assigned


  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize Swiper
      this.swiper = new Swiper('.mySwiper', {
        modules: [Navigation, Pagination, EffectCoverflow],
        loop: true,
        centeredSlides: true,  // Center the active slide
        slidesPerView: 3,  // Show 3 slides: 1 center and 2 on the sides
        spaceBetween: 30,  // Adjust the space between slides
        effect: 'coverflow',  // Create the 3D coverflow effect
        grabCursor: true,
        coverflowEffect: {
          rotate: 30,  // Rotation for the arc effect
          stretch: 10,  // Controls the spacing between the slides
          depth: 200,  // Controls the depth for a 3D effect
          modifier: 1,  // Controls the effect's intensity
          slideShadows: true,  // Keeps the shadows on the side slides for depth
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        initialSlide: 0, // Ensure the first slide is selected on page load
        on: {
          slideChangeTransitionStart: () => {
            this.updateSlideStyles();
          }
        }
      });

      // Make sure the first image is properly visible
      this.swiper.on('init', () => {
        this.updateSlideStyles(); // Call the function to update the styles
      });
    }
  }

  updateSlideStyles() {
    const activeIndex = this.swiper.activeIndex;
    const slides = this.swiper.slides;  // Accessing slides through swiper instance

    // Reset all slides to default opacity and scale
    slides.forEach((slide, index) => {
      slide.style.opacity = '0.4';  // Make inactive slides less visible
      slide.style.transform = 'scale(0.7)';  // Shrink inactive slides
    });

    // Highlight the active slide
    const activeSlide = slides[activeIndex];
    activeSlide.style.opacity = '1';  // Make the active slide fully visible
    activeSlide.style.transform = 'scale(1.1)';  // Scale the active slide up

    // Handle previous and next slides to give a sense of depth
    const previousSlide = slides[activeIndex - 1] || slides[slides.length - 1];  // Loop around
    const nextSlide = slides[activeIndex + 1] || slides[0];  // Loop around

    if (previousSlide) {
      previousSlide.style.opacity = '0.6';  // Slightly visible for the previous slide
      previousSlide.style.transform = 'scale(0.8)';  // Slightly smaller
    }

    if (nextSlide) {
      nextSlide.style.opacity = '0.6';  // Slightly visible for the next slide
      nextSlide.style.transform = 'scale(0.8)';  // Slightly smaller
    }
  }
}




// import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import Swiper from 'swiper';
// import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent implements AfterViewInit {
//   private swiper!: Swiper;  // Use non-null assertion to tell TypeScript the swiper will be assigned

//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

//   ngAfterViewInit() {
//     if (isPlatformBrowser(this.platformId)) {
//       // Initialize Swiper
//       this.swiper = new Swiper('.mySwiper', {
//         modules: [Navigation, Pagination, EffectCoverflow],
//         loop: true,
//         centeredSlides: true,  // Center the active slide
//         slidesPerView: 3,  // Show 3 slides: 1 center and 2 on the sides
//         spaceBetween: 30,  // Adjust the space between slides
//         effect: 'coverflow',  // Create the 3D coverflow effect
//         grabCursor: true,
//         coverflowEffect: {
//           rotate: 30,  // Rotation for the arc effect
//           stretch: 10,  // Controls the spacing between the slides
//           depth: 200,  // Controls the depth for a 3D effect
//           modifier: 1,  // Controls the effect's intensity
//           slideShadows: true,  // Keeps the shadows on the side slides for depth
//         },
//         navigation: {
//           nextEl: '.swiper-button-next',
//           prevEl: '.swiper-button-prev',
//         },
//         pagination: {
//           el: '.swiper-pagination',
//           clickable: true,
//         },
//         initialSlide: 0, // Ensure the first slide is selected on page load
//         on: {
//           slideChangeTransitionStart: () => {
//             this.updateSlideStyles();
//           }
//         }
//       });

//       // Make sure the first image is properly visible
//       this.swiper.on('init', () => {
//         this.updateSlideStyles(); // Call the function to update the styles
//       });
//     }
//   }

//   updateSlideStyles() {
//     const activeIndex = this.swiper.activeIndex;
//     const slides = this.swiper.slides;  // Accessing slides through swiper instance

//     // Reset all slides to default opacity and scale
//     slides.forEach((slide, index) => {
//       slide.style.opacity = '0.4';  // Make inactive slides less visible
//       slide.style.transform = 'scale(0.7)';  // Shrink inactive slides
//     });

//     // Highlight the active slide
//     const activeSlide = slides[activeIndex];
//     activeSlide.style.opacity = '1';  // Make the active slide fully visible
//     activeSlide.style.transform = 'scale(1.1)';  // Scale the active slide up

//     // Handle previous and next slides to give a sense of depth
//     const previousSlide = slides[activeIndex - 1] || slides[slides.length - 1];  // Loop around
//     const nextSlide = slides[activeIndex + 1] || slides[0];  // Loop around

//     if (previousSlide) {
//       previousSlide.style.opacity = '0.6';  // Slightly visible for the previous slide
//       previousSlide.style.transform = 'scale(0.8)';  // Slightly smaller
//     }

//     if (nextSlide) {
//       nextSlide.style.opacity = '0.6';  // Slightly visible for the next slide
//       nextSlide.style.transform = 'scale(0.8)';  // Slightly smaller
//     }
//   }
// }
