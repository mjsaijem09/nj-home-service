import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { BookingService } from 'src/app/services/booking.service';
import { LocationService } from 'src/app/services/location.service';
import { ScheduleService } from '../schedule/schedule.service'

@Component({
  selector: 'app-search-shop',
  templateUrl: './search-shop.component.html',
  styleUrls: ['./search-shop.component.scss']
})
export class SearchShopComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('serachIt') private elementRef!: ElementRef;
  isLoading: boolean = false;
  isMobile: boolean = false;
  autofocus = true;
  shopList:any = [];
  shops:any = [];
  searchTimeout: any;
  coordinates: any = { lat: 31.9523, lng: 115.8613 };   //Perth
  searchText = "";
  searchLocation = "";
  subscription!: Subscription;
  subscription2!: Subscription;
  constructor(
    private scheduleservice: ScheduleService,
    private router: Router,
    private apiService : ApiServicesService,
    private locationService: LocationService,
    private bookingService: BookingService,
    private element: ElementRef
    ) { }


  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();
    this.subscription2 = this.locationService.getUserSearch().subscribe((res:any) => {
      this.searchText = res;
    });
    this.subscription = this.locationService.getUserLocation().subscribe((res:any) => {
      this.searchLocation = res.address;
      if(res && res.latitude && res.longitude) {
         this.coordinates = {
            'lat': res.latitude,
            'lng': res.longitude,
          } 
          this.searchLocation =  res.name;
          this.getShopList();
        }
    }, (err:any) => {
      console.log(err);
    })
    this.element.nativeElement.querySelector('#searchShop').focus()     
  }

  ngOnDestroy() {
    if (this.subscription)
        this.subscription.unsubscribe()
    if (this.subscription2)
        this.subscription2.unsubscribe()
    }

  ngAfterViewInit(): void {
    // this.elementRef.nativeElement.focus();
  }

  search($event) {
    console.log($event);
    if(this.searchTimeout) {
      this.clearSearchTimeout();
    }
    this.searchTimeout = setTimeout(() => {
      this.getShopList();
      this.clearSearchTimeout();
    }, 500);
  }

  clearSearchTimeout() {
    clearTimeout(this.searchTimeout);
  }

  setDefaultPic(e: any) {
    e.target.src = './assets/images/no_image.png';
  }

  viewshopDetails(data: any) {
    console.log(data)
    this.router.navigate(['/shop-details'], {
      queryParams: {
        locationId: data._id,
        ownerId: data.ownerId,
        shopName: data.name,
        categoryId: data.categoryId && data.categoryId[0]
      },
    });
  }
  
  navigateToSearchCity() {
    this.router.navigate(['/search-city']);
  }
  
  navigateToShopDetail() {
    this.router.navigate(['/shop']);
  }

  getShopList() {
    this.isLoading = true;
    this.apiService.get(`get_shop_list?search=${this.searchText}&latt=${this.coordinates?.lat}&long=${this.coordinates?.lng}`).subscribe(res => {
      let data = res.result;
      this.shops = data.filter(item => item.onlineBooking);
      this.isLoading = false;
    },err => {
      this.isLoading = false;
      console.log(err);
    })
  }
  getShopGroupList() {
    this.isLoading = true;
    this.apiService.get(`get_shop_list?latt=${this.coordinates?.lat}&long=${this.coordinates?.lng}`).subscribe(res => {
      let data = res.result;
      this.shops = data.filter(item => item.onlineBooking);
      this.isLoading = false;
    },err => {
      this.isLoading = false;
      console.log(err);
    })
  }

}
