import { HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';

import { ActivatedRoute, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { HomeServiceService } from './home-service.service';
import { LocationService } from 'src/app/services/location.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { BookingService } from 'src/app/services/booking.service';
import { UiService } from 'src/app/services/ui.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationSelectionPopupComponent } from 'src/app/location-popups/location-selection-popup/location-selection-popup.component';
import { AskToChageLocationComponent } from 'src/app/location-popups/ask-to-chage-location/ask-to-chage-location.component';
import { GetCurrentLocationComponent } from 'src/app/location-popups/get-current-location/get-current-location.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  categoryList: any = [];
  categoryData: any = [];
  recentlyViewedList: any = [];
  loginData: any;
  isLoading: boolean = false;
  walletBalance: any;

  ScreenWidth!: number;
  ScreenHeight!: number;
  showMobile!: boolean;

  topCategories: any = [];

  subscription!: Subscription;
  userLocation = {
    countryCode: 'AU',
    latitude: -32.0376667,
    longitude: 115.4010622,
    name: 'Perth',
  };
  noLocationConatiner: boolean = true;
  isMobile: boolean = false;

  isHomePage: boolean = false;
  isBusinessPage: boolean = false;

  categoryListOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: false,
    dots: false,
    nav: false,
    margin: 30,
    items: 4,
    navText: [
      "<i class='fa fa-chevron-left'></i>",
      "<i class='fa fa-chevron-right'></i>",
    ],
    responsive: {
      0: {
        items: 4,
        margin: 15,
      },
      1440: {
        margin: 30,
      }
    },
  };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.ScreenWidth = event.target.innerWidth;
    this.ScreenHeight = event.target.innerHeight;
    if (this.ScreenWidth > 1024) {
      this.showMobile = false;
    } else if (this.ScreenWidth < 1024) {
      this.showMobile = true;
    }
  }

  constructor(
    private homeService: HomeServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiServicesService,
    private locationService: LocationService,
    private cdref: ChangeDetectorRef,
    private bookingService: BookingService,
    private modalService: NgbModal,
    private platform: Platform,
    private _ui: UiService
  ) {
    this.getScreenSize();
  }

  getScreenSize() {
    this.ScreenWidth = window.innerWidth;
    this.ScreenHeight = window.innerHeight;
    if (this.ScreenWidth > 1024) {
      this.showMobile = false;
    } else if (this.ScreenWidth < 1024) {
      this.showMobile = true;
    }
  }
  downloadPWA: boolean = true;
  ngOnInit(): void {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.downloadPWA = false
      console.log("This is running as standalone.");
    } else {
      this.downloadPWA = true
      console.log("This is running in browser.");
    }
    const location = localStorage.getItem('businessLocation');
    if (location) {
      this.isBusinessPage = true;
    } else {
      this.isHomePage = true;
    }
    this.isMobile = this.bookingService.isMobileView();
    this.fetchLocation();
    this.getSubdomain();
    if (this.homeSubdomain) {
      this.firstTimeData();
      this.qr();
    }
    this.beforeIsntall()
  }
  imgLink(e) {
    if(e === undefined || e === null) {
    } else {
      let splitLink = e.split("/");
      return `${environment.image_url}/uploads/${splitLink[splitLink.length - 1]}`;
    }
  }
  locationPermissionStatus() {
    console.log("triggered!");
    navigator.permissions.query({ name: 'geolocation' }).then((e) => {
      console.log('Location State:', e.state);
      if (e.state === 'prompt') {
        this.fetchLocation();
        setTimeout(() => {
          this.askLocationPermession();
        }, 1000);
      }
      if (e.state === 'granted') {
        this.locationService.getLocation();
        this.fetchLocation();
      }
    });
  }

  fetchLocation() {
    this.locationService.getUserLocation().subscribe((res) => {
      this.userLocation = {
        countryCode: res.countryCode,
        latitude: res.latitude,
        longitude: res.longitude,
        name: res.name,
      };
      this.fetchHomeData();
      this.initCategoryList();
    });
  }
  fetchHomeData() {
    
  };
  initCategoryList() {
    this.isLoading = true;
    this.apiService
      .get(
        `get_home_page?latt=${this.userLocation.latitude}6&long=${this.userLocation.longitude}&dis=50`
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          res.category.forEach(element => {
            let item = {
              id: element.category[0]._id,
              name: element.category[0].name,
              img: element.image,
              selected: false
            }
            this.categoryList.push(item);
            this.topCategories.push(item);
          });
        },
        (err) => {
          this.isLoading = true;
          console.log(err);
        }
      );
  }
  askLocationPermession() {
    this.modalService.open(AskToChageLocationComponent, {centered: true});
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewInit() {}


  selectCategory(item: any) {
    console.log('here', item);
    localStorage.setItem('categorySelected', JSON.stringify(item));
    this.router.navigate(['/category'], {
      queryParams: {
        category: item.name,
        id: item._id,
        categoryId: item.categoryId,
      },
    });
  }

  setDefaultPic(e: any) {
    return e.target.src = './assets/images/no_image.png';
  }

  viewshopDetails(data: any) {
    console.log(data);
    this.router.navigate(['/shop-details'], {
      queryParams: {
        locationId: data._id,
        ownerId: data.ownerId,
        shopName: data.name,
        categoryId: data.categoryId[0],
      },
    });
  }
  addressFormat(shop) {
    let address = '';
    if(shop.building && shop.building != '') {
      address = address+shop.building+', '
    }
    if(shop.street && shop.street != '') {
      address = address+shop.street+', '
    }
    if(shop.city && shop.city != '') {
      address = address+shop.city+', '
    }
    if(shop.state && shop.state != '') {
      address = address+shop.state+', '
    }
    if(shop.zip && shop.zip != '') {
      address = address+shop.zip
    }
    return address;
  }
  searchShopsText: string = "";
  searchShop(e) {
    this.locationService.setUserSearch(e);
    this.router.navigate(['/search-shop']);
  }

  navigateToSearchCity() {
    this.router.navigate(['/search-city'], {
      queryParams: {
        headerLocation: true,
      },
    });
  }
  goToShop(id) {
    this.router.navigate(['/shop', id], { state: { previous_url: '/' } });
  }
  navigateToCategoryShops(categoryName: any, categoryId: any) {
    // this.locationService.setUserSelectionLocation({
    //   latPosition: undefined,
    //   logPosition: undefined,
    //   address: undefined,
    // });
    this.router.navigate(['/category', categoryName, categoryId]);
  }
  home = false;
  sched = false;
  saved = false;
  notification = false;
  search = false;
  qrcode = false;
  firstTimeData() {
    let data = localStorage.getItem('firstTimeData');
    if (!data) {
      let json = {
        home: false,
        login: false,
        shop: false,
        qr: false,
        reviews: false,
        service_selection: false,
        pick_therapist: false,
        slot_selection: false,
        add_relation: false,
        checkout: false,
      };
      localStorage.setItem('firstTimeData', JSON.stringify(json));
    }
    this.userFirstTime();
  }
  userFirstTime() {
    let isLogIn =
      this.getCookie('customerLogin') &&
      JSON.parse(this.getCookie('customerLogin')!);
    let data = JSON.parse(localStorage.getItem('firstTimeData'));
    if (data.home == false) {
      setTimeout(() => {
        this.home = true;
      }, 2000);
    } else {
      if (this.homeSubdomain && data.qr == true) {
        if(this.userLocation.name == "Perth") {
          this.locationPermissionStatus();
        }
      } else if (!isLogIn && data.qr == false) {
        if(this.userLocation.name == "Perth") {
          this.locationPermissionStatus();
        }
      } 
      this.home = false;
    }
  }
  gotIt(e) {
    var data = JSON.parse(localStorage.getItem('firstTimeData'));
    data.home = true;
    localStorage.setItem('firstTimeData', JSON.stringify(data));
    if (e === 'home') {
      this.home = false;
      setTimeout(() => {
        this.sched = true;
      }, 1000);
    }
    if (e === 'sched') {
      this.sched = false;
      setTimeout(() => {
        this.saved = true;
      }, 1000);
    }
    if (e === 'saved') {
      this.saved = false;
      setTimeout(() => {
        this.notification = true;
      }, 1000);
    }
    if (e === 'notification') {
      this.notification = false;
      setTimeout(() => {
        this.search = true;
      }, 1000);
    }
    if (e === 'search') {
      this.search = false;
      let isLogIn =
        this.getCookie('customerLogin') &&
        JSON.parse(this.getCookie('customerLogin')!);
      if (isLogIn) {
        setTimeout(() => {
          this.qrcode = true;
        }, 1000);
      } else {
        this.locationPermissionStatus();
      }
    }
    if (e === 'qrcode') {
      data.login = true;
      data.qr = true;
      this.qrcode = false;
      localStorage.setItem('firstTimeData', JSON.stringify(data));
      this.locationPermissionStatus();
    }
  }
  qr() {
    let isLogin =
      this.getCookie('customerLogin') &&
      JSON.parse(this.getCookie('customerLogin')!);
    let data = JSON.parse(localStorage.getItem('firstTimeData'));
    if (isLogin && data.home == true) {
      if (data.login == false) {
        setTimeout(() => {
          this.qrcode = true;
        }, 1000);
      }
    }
  }

  subdomain: any;
  homeSubdomain: any;
  getSubdomain() {
    const domain = window.location.hostname;
    const [sub, main] = domain.split('.');
    if (sub.includes('home') || sub.includes('localhost')) {
      this.homeSubdomain = true;
    } else {
      this.homeSubdomain = false;
    }
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  public deferredPrompt;
  beforeIsntall() {
    console.log("beforeinstallprompt");
    window.addEventListener('beforeinstallprompt', event => {
    console.log("beforeinstallprompt", event);
      event.preventDefault();
      this.deferredPrompt = event;
    });
  }
  public iosDownloadGuide: boolean = false;
  installPWA() {
    if (this.platform.ANDROID || this.platform.isBrowser) {
      this.deferredPrompt.prompt();
    }
    if (this.platform.IOS) {
      this.iosDownloadGuide = true;
      setTimeout(() => {
        this.iosDownloadGuide = false;
      }, 9000);
    }
  }
 
}
