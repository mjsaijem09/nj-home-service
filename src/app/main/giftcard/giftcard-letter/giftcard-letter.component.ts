import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { GiftcardService } from '../giftcard.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-giftcard-letter',
  templateUrl: './giftcard-letter.component.html',
  styleUrls: ['./giftcard-letter.component.scss']
})
export class GiftcardLetterComponent implements OnInit {
  card: any;
  subscription: Subscription;
  loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
  public imgBaseUrl = environment.image_url;
  constructor(
    private route:Router,
    private gc: GiftcardService
    ) { }
  
  message: string;
  sender: string;
  receiver: string;
  isMobile: boolean = false;
  ngOnInit(): void {
    this.isMobile = this.gc.isMobileView();
    this.subscription = this.gc.getGiftcardDetails()
    .subscribe((details: any) => {
      this.card = details;
      this.sender = this.loginData?.result?.firstName ? this.loginData?.result?.firstName : '';
      this.receiver = details.receiver.firstName ? details.receiver.firstName : '';
      console.log(this.card);
    });
    console.log(this.card)
    if(!this.card.shopDetails.ownerid) {
      this.route.navigate(['/']);
    }
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  
  next(){
    this.card.letter = {
      receiver: this.receiver,
      sender: this.sender,
      message: this.message,
    }
    this.gc.setGiftcardDetails(this.card)
    this.route.navigate(['giftcard/delivery-date']); 
  }

}
