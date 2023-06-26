import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-send-giftcard',
  templateUrl: './send-giftcard.component.html',
  styleUrls: ['./send-giftcard.component.scss'],
})
export class SendGiftcardComponent implements OnInit {
  // sendCardObj

  imgString_url: string = `${environment.image_url}/uploads/`;
  giftCardToName: string;
  message: string;
  giftCardFromName: string;
  letter_bg: string;
  textColor: string;
  giftImage: string;
  voucherPrice: string;
  voucherId: string;
  shopName: string;
  shopStreet: string;
  shopCity: string;
  shopState: string;
  shopRating;
  constructor(private cdref: ChangeDetectorRef) {}

  ngOnInit(): void {
    let sendCardObj = JSON.parse(localStorage.getItem('sendGiftCardData'));
    console.log(sendCardObj);
    this.giftCardToName = sendCardObj.toName;
    this.message = sendCardObj.message;
    this.giftCardFromName = sendCardObj.fromName;
    this.letter_bg = this.imgString_url + sendCardObj.cardBgImage;
    this.textColor = sendCardObj.color;
    this.giftImage = sendCardObj.giftImage;
    this.voucherPrice = sendCardObj.voucher_amount;
    this.voucherId = sendCardObj.voucher_code;
    this.shopName = sendCardObj.locationName;
    this.shopStreet = sendCardObj.loc_street;
    this.shopCity = sendCardObj.loc_city;
    this.shopState = sendCardObj.loc_state;
    this.shopRating = sendCardObj.loc_rating;
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnDestroy() {
    localStorage.removeItem('sendGiftCardData');
  }
}
