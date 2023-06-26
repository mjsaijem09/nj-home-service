import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { MyBackpackComponent } from './my-backpack/my-backpack.component';
import { MyRelationshipsComponent } from './my-relationships/my-relationships.component';
import { MyLoyalityPointsComponent } from './my-loyality-points/my-loyality-points.component';
import { ReportBugComponent } from './report-bug/report-bug.component';
import { OnlineSupportComponent } from './online-support/online-support.component';
import { FaqCompComponent } from './faq-comp/faq-comp.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MyScoreComponent } from './my-score/my-score.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SendTipComponent } from './send-tip/send-tip.component';
import { BuyTipComponent } from './buy-tip/buy-tip.component';
import { NgxStripeModule } from 'ngx-stripe';
import { TipPaymentComponent } from './tip-payment/tip-payment.component';
import { SendGiftComponent } from './send-gift/send-gift.component';
import { GiftRecieverDetailComponent } from './gift-reciever-detail/gift-reciever-detail.component';
import { LetterTypeComponent } from './letter-type/letter-type.component';
import { GiftPreviewComponent } from './gift-preview/gift-preview.component';
import { GiftPaymentComponent } from './gift-payment/gift-payment.component';
import { ProfileComponent } from './profile/profile.component';
import { AddMoneyPopupComponent } from './my-wallet/add-money-popup/add-money-popup.component';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { ScannerComponent } from './scanner/scanner.component';
// import { ZXingScannerModule } from '@zxing/ngx-scanner';

const route : Routes = [
  {
    path : 'scanner',
    component : ScannerComponent,
  },
  {
    path : 'profile',
    component : ProfileComponent,
  },
  {
    // path : 'Wallet',
    path : 'wallet',
    component : MyWalletComponent,
  },
  {
    path : 'my-backpack',
    component : MyBackpackComponent,
  },
  {
    path : 'my-relationship',
    component : MyRelationshipsComponent,
  },
  {
    path : 'my-points',
    component : MyLoyalityPointsComponent,
  },
  {
    path : 'report-bug',
    component : ReportBugComponent,
  },
  {
    path : 'online-support',
    component : OnlineSupportComponent,
  },
  {
    path : 'faq',
    component : FaqCompComponent,
  },
  {
    path : 'my-score',
    component : MyScoreComponent,
  },
  {
    path:'send-tip',
    component:SendTipComponent
  },
  {
    path:'buy-tip',
    component:BuyTipComponent
  },
  {
    path:'buy-tip-pay',
    component:BuyTipComponent
  },
  {
    path:'tip-payment',
    component:TipPaymentComponent
  },
  
  {
    path:'send-gift',
    component:SendGiftComponent
  },
  {
    path:'gift-receiver',
    component:GiftRecieverDetailComponent
  },
  {
    path:'select-letter',
    component:LetterTypeComponent
  },
  {
    path:'gift-preview',
    component:GiftPreviewComponent
  },
  {
    path:'gift-payment',
    component:GiftPaymentComponent
  }
]

  
@NgModule({
  declarations: [
    MyWalletComponent,
    MyBackpackComponent,
    MyRelationshipsComponent,
    MyLoyalityPointsComponent,
    ReportBugComponent,
    OnlineSupportComponent,
    FaqCompComponent,
    MyScoreComponent,
    SendTipComponent,
    BuyTipComponent,
    TipPaymentComponent,
    TipPaymentComponent,
    SendGiftComponent,
    GiftRecieverDetailComponent,
    LetterTypeComponent,
    GiftPreviewComponent,
    GiftPaymentComponent,
    ProfileComponent,
    AddMoneyPopupComponent,
    ScannerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // CustomSpinnerModule,
    RouterModule.forChild(route),
    NgbModule,
    NgxStripeModule.forRoot('pk_test_VK47XeSEIbfr4iKhfmVHAtsr00cnZhNzel'),
    NgQrScannerModule,
    // ZXingScannerModule
  ],
  exports: [
    MyWalletComponent,
    MyBackpackComponent,
    MyRelationshipsComponent,
    MyLoyalityPointsComponent,
    ReportBugComponent,
    OnlineSupportComponent,
    FaqCompComponent,
    AddMoneyPopupComponent
  ]
})
export class SidemenuComponentsModule { }