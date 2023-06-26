import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { BookingService } from 'src/app/services/booking.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-shop-selection',
  templateUrl: './shop-selection.component.html',
  styleUrls: ['./shop-selection.component.scss']
})
export class ShopSelectionComponent implements OnInit, OnDestroy {

  routeData: any;
  id: any;
  blogList: any = [];
  sponsoredList: any = [];
  shopList: any = [];
  topRatedShopList: any = []
  topRankedTherapistList: any = []
  videosList: any = []
  topRatedTherapistList: any = []
  location: any
  latPosition: any
  logPosition: any;
  safeSrc: SafeResourceUrl | undefined
  videoUrl: any;
  thumbnail: any;
  newVideoData: any = []
  isShowSearchBar: boolean = false;
  searchText = "";
  shopType: string = 'nearest';
  ownerId: any;
  isLoading: boolean = false;
  coordinates: any = { lat: 31.9523, lng: 115.8613 };   //Perth
  shops:any = [];
  selectedShopIndex: number = 0;
  searchLocation = "";
  subscription!: Subscription;
  searchTimeout: any;
  businessLocation: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private locationService: LocationService,
    private apiService : ApiServicesService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    const location = localStorage.getItem('businessLocation') && JSON.parse(localStorage.getItem('businessLocation'));
    this.activatedRoute.params
    .subscribe(params => {
      this.ownerId = params['ownerId'];
    });

    if(!this.ownerId) {
      if(location) {
        this.businessLocation = location;
        this.ownerId = location?.ownerid;
      } else {
        this.router.navigate(['/']);
      }
    }

    this.subscription = this.locationService.getUserLocation().subscribe((res:any) => {
      if(res && res.latPosition && res.logPosition) { 
        this.coordinates = {
            'lat': res.latPosition,
            'lng': res.logPosition,
          } 
          this.searchLocation=  res.address
        } else {
        let customerLatLongAddress = JSON.parse(localStorage.getItem('customerLatLongAddress')!)
        if (customerLatLongAddress) {
          this.searchLocation = ""
          this.coordinates = {
            'lat': customerLatLongAddress.latPosition,
            'lng': customerLatLongAddress.logPosition,
          }
        } else {
          this.getGeoLocation()
        }
        }
    }, (err:any) => {
      console.log(err);
    })
    this.getShopList(this.shopType);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // routing
  goToTherapist(item: any) {
    console.log(item);
    this.router.navigate(['/therapist'], {
      queryParams: {
        therapistName: `${item.firstName} ${item.lastName}`,
        id: item._id,
      }
    })
  }
  
  navigateToSearchCity() {
    this.router.navigate(['/search-city']);
  }

  getGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          let lat = position.coords.latitude;
          let lng = position.coords.longitude;
          this.coordinates = {
            'lat': lat,
            'lng': lng,
          }
          this.getShopList(this.shopType);
        }
      },
      (error:any) => {
        return console.log(error);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  search() {
    if (this.searchTimeout) {
      this.clearSearchTimeout();
    }
    this.searchTimeout = setTimeout(() => {
      this.getShopList(this.shopType);
      this.clearSearchTimeout();
    }, 500);
  }

  clearSearchTimeout() {
    clearTimeout(this.searchTimeout);
  }

  getShopList(type: string) {
    if(this.coordinates) {
      this.isLoading = true;
      this.shopType = type;
      this.apiService.get(`get_owner_shop_list?latt=${this.coordinates?.lat}&long=${this.coordinates?.lng}&ownerId=${this.ownerId}&${type}=true`).subscribe(res => {
        this.shops = res.result;
        this.isLoading = false;
      },err => {
        this.isLoading = false;
        console.log(err);
      })
    }
  }

  setSelectedShopIndex(index) {
    this.selectedShopIndex = index;
  }

  book() {
    let bookingDetails: any = {
      shop: {
        locationId: this.shops[this.selectedShopIndex]?._id,
        ownerId: this.shops[this.selectedShopIndex]?.ownerId,
        name: this.shops[this.selectedShopIndex]?.name,
        loyaltyPoints: this.shops[this.selectedShopIndex]?.loyalty_points || 0,
        rating: this.shops[this.selectedShopIndex]?.rating,
        address: {
          bldg: this.shops[this.selectedShopIndex]?.building,
          street: this.shops[this.selectedShopIndex]?.street,
          city: this.shops[this.selectedShopIndex]?.city,
          state: this.shops[this.selectedShopIndex]?.state,
          zip: this.shops[this.selectedShopIndex]?.zip,
        },
        image: [this.shops[this.selectedShopIndex]?.profileImage],
      }
    }
    this.bookingService.bookingData = bookingDetails;
    if(this.businessLocation) {
      this.router.navigate(['/booking']);
    } else {
      this.router.navigate(['/service']);
    }
  }
}
