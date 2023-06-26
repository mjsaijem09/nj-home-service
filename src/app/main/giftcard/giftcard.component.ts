import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute, Router } from '@angular/router';
import { GiftcardService } from './giftcard.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

import { ApiServicesService } from 'src/app/services/api-services.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-giftcard',
  templateUrl: './giftcard.component.html',
  styleUrls: ['./giftcard.component.scss']
})
export class GiftcardComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: false,
    center: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    nav: false,
    navText: ["<span class='material-icons'>chevron_left</span>","<span class='material-icons'>chevron_right</span>"],
    responsive: {
      0: {
        items: 4
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4,
      },
      1024: {
        items: 4,
      },
    },
  }
  cardThemes: OwlOptions = {
    loop: false,
    center: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    nav: false,
    navText: ["<span class='material-icons'>chevron_left</span>","<span class='material-icons'>chevron_right</span>"],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1,
      },
      1440: {
        items: 1,
      },
    },
  }
  themes = [
    {_id: 0, name: 'Default', price: 0, img: '/assets/images/giftcard/default.svg', card: 'd8533b90-16f6-4c6e-829d-1cbb75a9463e.png', colorCode: '#90C63E', letter_bg: ''},
    {_id: 1, name: 'Birthday', price: 3, img: '/assets/images/giftcard/birthday.svg', card: 'ecca358d-a8ff-423a-ac5f-d1b173dc1dd9.png', colorCode: '#3B276D', letter_bg: '8bd2ebf1-8587-4095-9c2e-4453d19f3d42.png'},
    {_id: 2, name: 'Valentine', price: 3, img: '/assets/images/giftcard/valentine.svg', card: '2c5ebafc-98c9-4dc5-a517-05cbed0a68cc.png', colorCode: '#FD375F', letter_bg: 'c0b58741-e374-4916-8db2-4ce6732a2ef1.png'},
    {_id: 3, name: 'Christmas', price: 3, img: '/assets/images/giftcard/xmas.svg', card: 'd612aaa0-f4bf-4401-8aa8-d29cb443bbc1.png', colorCode: '#006087', letter_bg: 'bc0197b0-ee7a-450b-9725-aeebbcd984da.png'},
    {_id: 4, name: 'Halloween', price: 3, img: '/assets/images/giftcard/halloween.svg', card: '3f0593c6-84af-4548-ae96-e67d78e7d8fb.png', colorCode: '#180015', letter_bg: '633e0ebc-29a1-43c1-8aca-c5d364a2dfbd.png'},
    {_id: 5, name: 'Mom Day', price: 3, img: '/assets/images/giftcard/momday.svg', card: '3876799a-a892-4ed3-8434-c80ae8829076.png', colorCode: '#856BFF', letter_bg: '893db87a-07a2-4377-bee3-e0372160a55f.png'},
    {_id: 6, name: 'Dad Day', price: 3, img: '/assets/images/giftcard/dadday.svg', card: 'fe1b7512-1b0f-44cb-a2b1-18b322d3dadf.png', colorCode: '#12659B', letter_bg: 'ae86effa-8661-4d5b-a5c3-65ccfa8ecdc4.png'},
    {_id: 7, name: 'New Year', price: 3, img: '/assets/images/giftcard/newyear.svg', card: 'adc440ed-3bee-468d-942f-9d95daf3e895.png', colorCode: '#187F35', letter_bg: '06141c7a-bbb5-4358-b567-7cf4f744cdeb.png'},
    {_id: 8, name: 'Anniv', price: 3, img: '/assets/images/giftcard/anniv.svg', card: '5dfc7e84-eccb-44ff-819a-2b962f13cb92.png', colorCode: '#ED2D3F', letter_bg: '2086d994-82eb-4203-9846-9eef40a22a52.png'},
  ];
  cards = [
    {_id: 0, name: 'Default', price: 0, img: '/assets/images/giftcard/default_gc.svg', },
    {_id: 1, name: 'Birthday', price: 3, img: '/assets/images/giftcard/birthday_gc.svg', },
    {_id: 2, name: 'Valentine', price: 3, img: '/assets/images/giftcard/valentine_gc.svg', },
    {_id: 3, name: 'Christmas', price: 3, img: '/assets/images/giftcard/christmas_gc.svg', },
    {_id: 4, name: 'Halloween', price: 3, img: '/assets/images/giftcard/halloween_gc.svg', },
    {_id: 5, name: 'Mom Day', price: 3, img: '/assets/images/giftcard/mothersday_gc.svg', },
    {_id: 6, name: 'Dad Day', price: 3, img: '/assets/images/giftcard/fathersday_gc.svg', },
    {_id: 7, name: 'New Year', price: 3, img: '/assets/images/giftcard/newyear_gc.svg', },
    {_id: 8, name: 'Anniv', price: 3, img: '/assets/images/giftcard/anniv_gc.svg', },
  ];

  theme = this.themes[0];
  giftcardDetails: any;
  subscription: Subscription;
  loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
  isMobile: boolean = false;
  public env = environment.image_url+'/uploads/';
  constructor(
    private route: Router,
    private gc: GiftcardService,
    private http: ApiServicesService,
    private activeR: ActivatedRoute,
    private location: Location,
    ) {}
  
  ngOnInit(): void {
    this.loginData
    this.isMobile = this.gc.isMobileView();
    if(this.loginData == null){
      this.route.navigate(['/auth/login']);
    }
    this.subscription = this.gc.getGiftcardDetails()
    .subscribe((details: any) => {
      this.giftcardDetails = details;
      if(!this.giftcardDetails?.shopDetails?.ownerid) {
        console.log(this.giftcardDetails?.shopDetails?.ownerid == undefined && this.loginData== null);
        this.location.back();
      }
    });
    if (this.activeR.snapshot.params.shopId) {
      this.http.get(`get_shop_detail?locationId=${this.activeR.snapshot.params.shopId}&detail=true`).subscribe( res => {
        this.giftcardDetails.shopDetails = res.result;
        this.giftcardDetails.shopDetails.locationId = this.activeR.snapshot.params.shopId;
        this.gc.setGiftcardDetails(this.giftcardDetails)
        this.giftCardData()
      })
    } else {
      this.giftCardData()
    }
  }

  giftCardData() {
    this.subscription = this.gc.getGiftcardDetails()
    .subscribe((details: any) => {
      this.giftcardDetails = details;
    });
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  selectTheme(data) {
    this.theme = data;
    console.log(data);
  }

  next(){
    this.giftcardDetails.card = this.theme;
    this.gc.setGiftcardDetails(this.giftcardDetails)
    console.log("VALID")
    this.route.navigate(['giftcard/receiver-details']);
  }

  getBackgroundImage() {
    return `url('${this.env}${this.theme.letter_bg}')`;
  }
  ShowSwipeIndication = true
  drag(e){
    if(e.startPosition >= 5) {
      this.ShowSwipeIndication = false
    }
    console.log(e)
  }

}
