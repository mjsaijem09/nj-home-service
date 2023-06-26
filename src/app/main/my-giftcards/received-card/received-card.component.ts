import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-received-card',
  templateUrl: './received-card.component.html',
  styleUrls: ['./received-card.component.scss'],
})
export class ReceivedCardComponent implements OnInit {
  clientId =
    this.getCookie('customerLogin') &&
    JSON.parse(this.getCookie('customerLogin')!);

  noCardPresent: boolean = false;
  giftcards: any = [];
  isLoading: boolean = true;
  imgString_url: string =  `${environment.image_url}/uploads/`;

  constructor(private service: ApiServicesService, public router: Router) {}

  ngOnInit(): void {
    this.getReceivedCards();
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  getReceivedCards() {
    this.isLoading = true;
    this.service.get(`findmygiftcard?clientId=${this.clientId.client}&received=true`)
    .subscribe((res) => {
      console.log(res.result);
      this.giftcards = res.result;
      if(res.result.length == 0) {
        this.noCardPresent = true;
      }
      this.isLoading = false;
    });
  }
  giftcardImg(e) {
    return `${environment.image_url}/uploads/${e}`;
  }
  noImg(e) {
    e.target.src = 'assets/images/giftcard/hand-giftcard.svg';
  }
  navigateToShop(e) {
    console.log(e);
    this.router.navigate(['shop', e]);
  }
}
