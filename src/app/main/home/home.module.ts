import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxStarsModule } from 'ngx-stars';
import { NgxStripeModule } from 'ngx-stripe';
import { HammerModule } from '@angular/platform-browser';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent } from '../home/home.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SharedComponentModule } from 'src/app/shared-components/shared-component.module';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { SwipeAngularListModule } from 'swipe-angular-list';

import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  
]

@NgModule({
  declarations: [
    ScrollSpyDirective,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxStarsModule,
    NgxMaterialTimepickerModule,
    SharedComponentModule,
    NgxStripeModule.forRoot('pk_test_VK47XeSEIbfr4iKhfmVHAtsr00cnZhNzel'),
    CarouselModule,
    NgxIntlTelInputModule,
    NgxStarsModule,
    HammerModule,
    SwipeAngularListModule,
    Ng2SearchPipeModule,
    SharedModule,
    PipesModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [DatePipe],
})
export class HomeModule {}
