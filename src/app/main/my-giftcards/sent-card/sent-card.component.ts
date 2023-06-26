import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-sent-card',
  templateUrl: './sent-card.component.html',
  styleUrls: ['./sent-card.component.scss'],
})
export class SentCardComponent implements OnInit {
  clientId =
    this.getCookie('customerLogin') &&
    JSON.parse(this.getCookie('customerLogin')!);

  giftcards: any = [];
  isLoading: boolean = true;

  imgString_url: string = environment.image_url+'/uploads/';

  constructor(private service: ApiServicesService, public router: Router) {}

  ngOnInit(): void {
    this.getSendCards();
  }

  getSendCards() {
    this.isLoading = true;
    this.service.get(`findmygiftcard?clientId=${this.clientId.client}&sent=true`)
    .subscribe((res) => {
      console.log(res);
      this.giftcards = res.result.reverse();
      this.isLoading = false;
    });
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
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
