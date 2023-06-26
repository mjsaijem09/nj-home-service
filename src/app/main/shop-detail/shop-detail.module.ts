import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopDetailComponent } from './shop-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from 'src/app/shared/shared.module';
const route : Routes = [
  {
    path : ':locationId',
    component : ShopDetailComponent,
  },
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CarouselModule,
    SharedModule
  ]
})
export class ShopDetailModule { }
