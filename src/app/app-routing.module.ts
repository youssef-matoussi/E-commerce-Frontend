import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'products/:gender/:category/:subcategory', component: ProductListComponent },
  { path: 'products/:gender/:category/:subcategory/:reference', component: ProductDetailsComponent }, // Route for product details

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
