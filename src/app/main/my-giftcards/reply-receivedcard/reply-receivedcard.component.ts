import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-reply-receivedcard',
  templateUrl: './reply-receivedcard.component.html',
  styleUrls: ['./reply-receivedcard.component.scss'],
})
export class ReplyReceivedcardComponent implements OnInit {
  imgString_url: string = `${environment.image_url}/uploads/`;
  letter_bg: string;
  giftCardToName: string;
  giftCardFromName: string;
  voucherId: string;
  voucherPrice: string;
  textColor: string;
  giftImage: string;
  message: string;
  shopName: string;
  shopStreet: string;
  shopCity: string;
  shopState: string;
  shopRating: any;

  constructor(private cdref: ChangeDetectorRef) {}

  ngOnInit(): void {
    let replyCardObj = JSON.parse(localStorage.getItem('replyGiftCardData'));

    this.giftCardToName = replyCardObj.toName;
    this.message = replyCardObj.message;
    this.giftCardFromName = replyCardObj.fromName;
    this.letter_bg = this.imgString_url + replyCardObj.cardBgImage;
    this.textColor = replyCardObj.color;
    this.giftImage = replyCardObj.giftImage;
    this.voucherPrice = replyCardObj.voucher_amount;
    this.voucherId = replyCardObj.voucher_code;
    this.shopName = replyCardObj.locationName;
    this.shopStreet = replyCardObj.loc_street;
    this.shopCity = replyCardObj.loc_city;
    this.shopState = replyCardObj.loc_state;
    this.shopRating = replyCardObj.loc_rating;
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnDestroy() {
    localStorage.removeItem('replyGiftCardData');
  }
}
