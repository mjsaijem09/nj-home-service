import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { BookingService } from 'src/app/services/booking.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { distinctUntilChanged } from 'rxjs/operators';

export interface Types {
  result: [];
}
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})


export class ShopComponent implements OnInit {
  @Input() shop: any = [];
  @Input() index: any;
  @Input() selectedShopIndex: any;
  @Input() isBusinessPage: boolean = false;
  @Input() isSelectShopsPage: boolean = false;
  @Output() setSelectedShop : EventEmitter<any> = new EventEmitter();
  
  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private bookingService: BookingService,
    private httpService: ApiServicesService
  ) { }

  ngOnInit(): void {
  }
   
  setDefaultPic(e: any) {
    e.target.src = './assets/images/no_image.png';
  }
  imgLink(e) {
    const isArray = Array.isArray(this.shop.profileImg)
    if(isArray == true) {
      let newArr = e.filter( obj => obj.isCoverPhoto == true);
      if(newArr.length > 0) {
        let splitLink = newArr[0]?.img.split("/");
        return `${environment.image_url}/uploads/${splitLink[splitLink.length - 1]}`;
      }
    } else {
      let splitLink = e?.img.split("/");
      if(splitLink != undefined) {
        return `${environment.image_url}/uploads/${splitLink[splitLink.length - 1]}`;
      }
    }
    
  }
  navigateToShopDetail() {
    if(!this.isSelectShopsPage) {
      this.router.navigate(['/shop', this.shop?._id]);
    }
  }

  navigateToShopRating() {
    this.router.navigate(['/shop-rating', this.shop?._id]);
  }

  navigateToSearchCity() {
    this.router.navigate(['/search-city']);
  }

  toggleHeart() {
    const userData = this.authService.getUserData();
    if (!userData) {
      // let qParams: any;
      // this.activatedRoute.queryParams.subscribe(params => {
      //   qParams = params;
      // });
      // qParams = _.cloneDeep(qParams);
      // qParams.pathUrl = window.location.pathname;
      // this.router.navigate(['auth/login'], {queryParams : qParams});
      // return false;
      this.router.navigate(['auth/login']);
    }

    if (this.shop.favFlag) {
      this.httpService.delete(`shop/${this.shop?._id}`).subscribe(res => {
        if (res && res.status == 200) {
          this.shop.favFlag = false;
        }
      });
    } else {
      let payload = {
        favShop: this.shop?._id
      };
      this.httpService.put(`update_profile?id=${userData.result._id}&clientId=${userData.client}`, payload)
        .pipe(distinctUntilChanged())
        .subscribe(res => {
        if (res && res.status == 200) {
          this.shop.favFlag = true;
        }
      });
    }
  }
  
  selectShop() {
    console.log(this.shop)
    let bookingDetails: any = {
      shop: {
        locationId: this.shop?._id,
        ownerId: this.shop?.ownerId,
        name: this.shop?.name,
        loyaltyPoints: this.shop?.loyaltyPoints,
        rating: this.shop?.rating,
        selectTherapist: this.shop?.onlineBookingRules?.selectTherapist,
        address: {
          bldg: this.shop?.building,
          street: this.shop?.state,
          city: this.shop?.city,
          state: this.shop?.state,
          zip: this.shop?.zip,
        },
        image: this.shop?.profileImg,
      }
    }
    console.log(bookingDetails)
    this.bookingService.bookingData = bookingDetails
    this.router.navigate(['/service']);
  }

  setSelectedShopIndex() {
    if(this.isSelectShopsPage) {
      this.setSelectedShop.emit(this.index);
    }
  }

  moreInfo() {
    this.router.navigate(['/shop', this.shop?._id]);
  }
}