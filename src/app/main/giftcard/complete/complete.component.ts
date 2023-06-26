import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GiftcardService } from '../giftcard.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {
  subscription: Subscription;
  card: any;
  theme: any;
  sender: any;
  receiver: any;
  message: any;
  loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
  shopLocation: any;
  businessPhone='';
  public imgBaseUrl = environment.image_url;
  constructor(
    private route: Router,
    private gc: GiftcardService
  ) { }

  ngOnInit(): void {
    this.subscription = this.gc.getGiftcardDetails()
    .subscribe((details: any) => {
      this.card = details;
      this.theme = details.letter.theme;
      this.sender = this.loginData?.result?.firstName ? this.loginData?.result?.firstName : '' + this.loginData?.result?.lastName ? this.loginData?.result?.lastName : '';
      this.receiver = details.receiver.firstName ? details.receiver.firstName : '';
      this.message = details.letter.message;
      //Shop Details 
      this.shopLocation = `${details.shopDetails?.companyStreet}, ${details.shopDetails?.companyCity}, ${details.shopDetails?.companyState}, ${details.shopDetails?.companyZip}`
    });
    this.businessPhone = 'tel:'+this.card?.shopDetails?.companyPhone.replace(/\s+/g, '');
    console.log(this.card)
    if(this.card?.shopDetails?.ownerid === undefined) {
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
  public rating(r) {
    return Math.round(r * 10) / 10
  }

  navigateToShop(id) {
    this.route.navigate([`/shop/${id}`]);
  }

}
