import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { BookingService } from 'src/app/services/booking.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss']
})
export class ShopDetailsComponent implements OnInit {
  userData: any;
  locationId: any;
  newDate: any;
  shopDetails:any;
  companyName:any;
  companyStreet:any;
  therapist:any;
  totalStar:any
  star_count:any
  public isCollapsed = false;
  timingAvailable: any;
  servicesProvided: any = [];
  serviceData : any = [];
  ownerId: any;
  categoryId: any;
  shopName: any;
  id:any
  therapistDetails:any=[];
  moment: any = moment;
  isFavouriteShop: boolean = false;
  isMobile: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute ,
    private httpService: ApiServicesService,
    private router:Router,
    private authService:AuthServiceService,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();
    this.userData = this.authService.getUserData();
    this.getShopId()
  }

  getShopId(){
    this.activatedRoute.queryParams.subscribe(params => {
      this.shopName=params['shopName']
      this.locationId = params['locationId'];
      this.ownerId = params['ownerId'];
      this.categoryId = params['categoryId'];
      this.newDate = new Date().toISOString();
  });
   this.getShopDetails()
  }

  getShopDetails(){
    this.httpService.get(`pwa/get_shop_detail?locationId=${this.locationId}&list=true&start_date=${this.newDate}&pwa=true`).subscribe(res=>{
      this.shopDetails = res.result;
      this.therapistDetails =res.result.therapist
      console.log(this.shopDetails)
      this.timingAvailable = res.result.openHours;
      this.servicesProvided = this.shopDetails.services;

      if (this.shopDetails && this.shopDetails.favShop.includes(this.locationId)) {
        this.isFavouriteShop = true;
      }
      this.servicesProvided.forEach((ele:any) => {
        ele.pricing_option.forEach((element:any) => {
          element.name = ele.name;
          this.serviceData.push(element)
        });
      });
    })
  }

  // routing
  goToService(){
    this.router.navigate(['/select-service'],{queryParams: {
      locationId: this.locationId,
      ownerId : this.ownerId,
      shopName:this.shopName,
      categoryId:this.categoryId,
      loyalityPoint:this.shopDetails?.loyalty_points
    }});
  }

  goTOReview(){
    this.router.navigate(['/all-reviews'],{queryParams: {
      locationId: this.locationId
    }});
  }

  // add shop in favourite//

  addShopTofavourite(){
    if (!this.userData) {
      let qParams: any;
      this.activatedRoute.queryParams.subscribe(params => {
        qParams = params;
      });
      qParams = _.cloneDeep(qParams);
      qParams.pathUrl = window.location.pathname;
      this.router.navigate(['auth/login'], {queryParams : qParams});
      return false;
    }

    if (this.isFavouriteShop)
    {
      this.httpService.delete(`customers/shop/${this.locationId}`).subscribe(res => {
        if (res && res.status == 200) {
          this.isFavouriteShop = false;
        }
      });
    }
    else
    {
      let payload = {
        "favShop": this.locationId
      };
      this.httpService.put(`customers?id=${this.userData.result._id}&clientId=${this.userData.client}`, payload)
        .pipe(distinctUntilChanged())
        .subscribe(res => {
        if (res && res.status == 200) {
          this.isFavouriteShop = true;
        }
      });
    }
  }
}
