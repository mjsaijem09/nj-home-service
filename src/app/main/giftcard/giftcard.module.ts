import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { GiftcardComponent } from './giftcard.component';
import { ReceiverDetailsComponent } from './receiver-details/receiver-details.component';
import { GiftcardLetterComponent } from './giftcard-letter/giftcard-letter.component';
import { PurchaseGiftcardComponent } from './purchase-giftcard/purchase-giftcard.component';
import { DeliveryDateComponent } from './delivery-date/delivery-date.component';
import { CompleteComponent } from './complete/complete.component';
import { DeliveryDatePickerComponent } from './delivery-date/delivery-date-picker/delivery-date-picker.component';

import { SharedModule } from 'src/app/shared/shared.module';

const route : Routes = [
  {
    path: '',
    component: GiftcardComponent,
  },
  {
    path: 'receiver-details',
    component: ReceiverDetailsComponent,
  },
  {
    path: 'giftcard-letter',
    component: GiftcardLetterComponent,
  },
  {
    path: 'delivery-date',
    component: DeliveryDateComponent,
  },
  {
    path: 'delivery-date-picker',
    component: DeliveryDatePickerComponent,
  },
  {
    path: 'purchase-giftcard',
    component: PurchaseGiftcardComponent,
  },
  {
    path: 'complete-purchase',
    component: CompleteComponent,
  },
];
@NgModule({
  declarations: [
    GiftcardComponent,
    ReceiverDetailsComponent,
    GiftcardLetterComponent,
    PurchaseGiftcardComponent,
    DeliveryDateComponent,
    CompleteComponent,
    DeliveryDatePickerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    CarouselModule,
    SharedModule
  ]
})
export class GiftcardModule { }
