import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineShopComponent } from './online-shop/online-shop.component';
import { ProfileSectionComponent } from './components/profile-section/profile-section.component';
import { SearchInShopComponent } from './components/search-in-shop/search-in-shop.component';
import { ShopNavbarComponent } from './components/shop-navbar/shop-navbar.component';
import { ProductListingComponent } from './components/product-listing/product-listing.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { VoucherComponent } from './components/voucher/voucher.component';
import { VoucherCarouselComponent } from './components/voucher-carousel/voucher-carousel.component';
import { RecommendedComponent } from './components/recommended/recommended.component';
import { IntoductionComponent } from './components/intoduction/intoduction.component';
import { BannerCarouselComponent } from './components/banner-carousel/banner-carousel.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductCarouselComponent } from './components/product-carousel/product-carousel.component';

@NgModule({
  declarations: [
    OnlineShopComponent,
    ProfileSectionComponent,
    SearchInShopComponent,
    ShopNavbarComponent,
    ProductListingComponent,
    ProductCardComponent,
    VoucherComponent,
    VoucherCarouselComponent,
    RecommendedComponent,
    IntoductionComponent,
    BannerCarouselComponent,
    CategoriesComponent,
    ProductCarouselComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
  ],
  exports: [
    OnlineShopComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OnlineShopModule { }
