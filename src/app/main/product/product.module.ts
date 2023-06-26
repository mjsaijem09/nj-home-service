import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxStarsModule } from 'ngx-stars';

import { SharedModule } from 'src/app/shared/shared.module';

import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { LocationOptionComponent } from './product-details/location-option/location-option.component';
import { ProductsComponent } from './products/products.component';
import { ProductToRateComponent } from './product-to-rate/product-to-rate.component';
import { ProductRatingsComponent } from './product-ratings/product-ratings.component';
import { ProductCustomerReviewComponent } from './product-customer-review/product-customer-review.component';
import { VariationOptionComponent } from './variation-option/variation-option.component';
import { ProductShopComponent } from './components/product-shop/product-shop.component';
import { ProductOverviewComponent } from './components/product-overview/product-overview.component';
import { ProductSpecsComponent } from './components/product-specs/product-specs.component';
import { ProductHeaderComponent } from './components/product-header/product-header.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';

const route: Routes = [
  {
    path: 'cart',
    component: ProductCartComponent
  },
  {
    path: 'checkout',
    component: ProductCheckoutComponent
  },
  {
    path: 'all/:owner/:location',
    component: ProductsComponent,
  },
  {
    path: 'rate-product/:id',
    component: ProductToRateComponent,
  },
  {
    path: 'ratings/:id',
    component: ProductRatingsComponent,
  },
  {
    path: ':product_id/:location_id',
    component: ProductDetailsComponent,
  },
]

@NgModule({
  declarations: [
    ProductDetailsComponent,
    ProductCheckoutComponent,
    ProductCartComponent,
    LocationOptionComponent,
    ProductsComponent,
    ProductToRateComponent,
    ProductRatingsComponent,
    ProductCustomerReviewComponent,
    VariationOptionComponent,
    ProductShopComponent,
    ProductOverviewComponent,
    ProductSpecsComponent,
    ProductHeaderComponent,
    ShoppingCartComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    SharedModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStarsModule
  ]
})
export class ProductModule { }
