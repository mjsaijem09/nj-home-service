import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MyGiftcardsComponent } from './my-giftcards.component';
import { ReceivedCardComponent } from './received-card/received-card.component';
import { SentCardComponent } from './sent-card/sent-card.component';
import { ReplyReceivedcardComponent } from './reply-receivedcard/reply-receivedcard.component';
import { SendGiftcardComponent } from './send-giftcard/send-giftcard.component';
import { SharedModule } from 'src/app/shared/shared.module';

const route : Routes = [
  {
    path : '',
    component : MyGiftcardsComponent,
  },
  {
    path: 'reply-receivedCard',
    component: ReplyReceivedcardComponent,
  },
  {
    path: 'send-giftCard',
    component: SendGiftcardComponent,
  }
];
@NgModule({
  declarations: [
    MyGiftcardsComponent,
    ReceivedCardComponent,
    SentCardComponent,
    ReplyReceivedcardComponent,
    SendGiftcardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    SharedModule
  ]
})
export class MyGiftcardsModule { }
