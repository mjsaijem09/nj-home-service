import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { SerachLocationComponent } from 'src/app/shared-components/serach-location/serach-location.component';
import { environment } from 'src/environments/environment';
declare var $: any;
declare var google: any;
import { Location } from '@angular/common';
import { BookingService } from 'src/app/services/booking.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  map,
} from 'rxjs/operators';
import { LocationService } from 'src/app/services/location.service';
import { MassageControlComponent } from 'src/app/shared-components/massage-control/massage-control.component';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import {
  BehaviorSubject,
  fromEvent,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { ScheduleService } from 'src/app/main/schedule/schedule.service';
import * as _ from 'lodash';
import { LOGIN } from '../url';
import { tap } from 'lodash';
import { ReportBugPopupComponent } from 'src/app/report-bug-popup/report-bug-popup.component';
import { OnlineSupportPopupComponent } from 'src/app/online-support-popup/online-support-popup.component';
import { InviteFriendPopupComponent } from 'src/app/invite-friend-popup/invite-friend-popup.component';
import { CreditService } from 'src/app/main/mywallet/credit.service';
import { LocationSelectionPopupComponent } from 'src/app/location-popups/location-selection-popup/location-selection-popup.component';
import { GetCurrentLocationComponent } from 'src/app/location-popups/get-current-location/get-current-location.component';
import { NotificationService } from 'src/app/services/notification.service';
import { LoyaltyPointsReceivedComponent } from 'src/app/notification-popups/loyalty-points-received/loyalty-points-received.component';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent
  implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy
{
  moment = moment;
  isHomeHeader: boolean = false;
  presentUrl: any;
  authHeader: boolean = true;
  customerDetails: any;
  @ViewChild('sidenav', { static: true }) sidenav!: ElementRef;
  @ViewChild('content2', { static: true }) content2!: ElementRef;
  @ViewChild('massageContent', { static: true }) massageContent!: ElementRef;
  route_title: any = '';
  sheildData: any;
  categoryRoute: any = '';
  locationList = '';
  locationData = '';
  percentage = 0;
  ScreenWidth: number | undefined;
  ScreenHeight: number | undefined;
  ShowMobile: boolean | undefined;
  isLocation: boolean | undefined;

  /* Booking Timer */
  bookingDetails: any;
  startBookingTime: boolean = false;
  bookingTimeConfig = { leftTime: 300, format: 'm:s' };
  serviceTimeConfig = { leftTime: 300, format: 'm:s' };
  userLocation: any = '';
  isShowSearchBar: any;
  customerLocation: any;
  todayAppointment: any;
  time: any;
  selectedAppointmentData: any;
  today = new Date();
  currentLocation: any;
  lat: any;
  getAddress: any;
  lng: any;
  searchInMeter: any;
  searchShopsText: any = '';
  shopList: any = [];
  copyShopList: any = [];
  searchShopEvent$ = new BehaviorSubject('');
  searchShopList: any = '';
  inter: any;
  nomoreTime = false;
  ratingDisplay: number = 3;
  openScanner: boolean = false;
  subscription!: Subscription;
  isBusinessPage: boolean;
  lookupAddress: any;
  notifCount: any = 0;
  cartData: any = [];
  constructor(
    private router: Router,
    private service: ApiServicesService,
    private route: ActivatedRoute,
    public _modal: NgbModal,
    private location: Location,
    private bookingService: BookingService,
    public locationService: LocationService,
    private cdref: ChangeDetectorRef,
    private scheduleService: ScheduleService,
    private creditService: CreditService,
    private notificationService: NotificationService,
    private cartService: CartService
  ) {
    setInterval(() => {
      this.getScreenSize();
      // this.displayHeader();
    }, 100);
  }
  getScreenSize() {
    this.ScreenWidth = window.innerWidth;
    this.ScreenHeight = window.innerHeight;
    if (this.ScreenWidth > 1024) {
      this.ShowMobile = false;
    } else if (this.ScreenWidth < 1024) {
      this.ShowMobile = true;
    }
  }
  ngOnInit(): void {
    this.cartService.getCartData().subscribe((res) => {
      this.cartData = res;
    });
    let data;
    this.customerDetails =
      this.getCookie('customerLogin') &&
      JSON.parse(this.getCookie('customerLogin')!);
    data = JSON.parse(localStorage.getItem('customerLocation')!);
    let customerLatLongAddress = JSON.parse(
      localStorage.getItem('customerLatLongAddress')!
    );
    if (this.customerDetails !== undefined || this.customerDetails !== null) {
      this.getProfile();
    }
    if (customerLatLongAddress) {
      this.userLocation = customerLatLongAddress.address
        ? customerLatLongAddress.address
        : this.getGeoCity(data);
      let coordinates = {
        lat: customerLatLongAddress.latPosition,
        lng: customerLatLongAddress.logPosition,
      };
      this.setUserLocation(coordinates);
    } else {
      if (data) {
        this.locationList = data && data.formatted_address;
        this.setUserLocation();
      } else {
      }
    }

    this.bookingService.getSlotBookingTime().subscribe((obj: any) => {
      if (obj.data == null) {
        this.startBookingTime = false;
      } else {
        this.bookingDetails = obj;
        this.startBookingTime = false;
        setTimeout(() => {
          this.startBookingTime = true;
        }, 1000);
      }
    });
    this.loadCredits();
    this.observeUserAddress();
    this.notificationService.getNotification().subscribe((res) => {
      if (res.status == '11') {
        let loyaltyPoints = this._modal.open(LoyaltyPointsReceivedComponent, {
          centered: true,
        });
        loyaltyPoints.componentInstance.data = res;
      }
    });
    this.notificationService.getNotification().subscribe((res) => {
      this.hasNotif();
    });
    this.notificationService.notificationIsRead().subscribe((res) => {
      this.hasNotif();
    });
  }
  clientData: any;
  getProfile() {
    this.service
      .get(`get_profile/${this.customerDetails?.result?._id}`)
      .subscribe((res) => {
        this.clientData = res.result;
      });
  }
  imgLink(e) {
    if (e === undefined || e === null) {
    } else {
      let splitLink = e.split('/');
      return `${environment.image_url}/uploads/${
        splitLink[splitLink.length - 1]
      }`;
    }
  }
  hasNotif() {
    if (this.customerDetails?.result._id) {
      this.service
        .get(`notification_list/customer/${this.customerDetails.result._id}`)
        .subscribe(
          (res) => {
            let readTrueList = res['result'].filter((i) =>
              [false].includes(i.read)
            );
            this.notifCount = readTrueList.length;
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  observeUserAddress() {
    this.locationService.getUserLocation().subscribe((res) => {
      this.lookupAddress = res.name + ', ' + res.countryCode;
    });
  }
  accBalance = 0;
  loadCredits() {
    if (this.customerDetails) {
      this.creditService.myCredits().subscribe((res) => {
        if (res['status'] == 200) {
          this.accBalance = res['result'].walletBalance;
        }
      });
    }
  }
  formatAccBalance(e) {
    return new Intl.NumberFormat().format(e);
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.hideNavbar();
    this.displayHeader();
    this.router.events.subscribe((r) => {
      if (this.router.url.includes('home')) {
        this.authHeader = false;
      }
      if (this.router.url.includes('auth')) {
        this.authHeader = true;
        this.isHomeHeader = false;
      }
    });
    this.isLocation = false;
    this.service.getLoginDataa().subscribe((res) => {
      if (res) {
        this.customerDetails = res;
      }
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.displayHeader();
      });

    this.cdref.detectChanges();
  }

  displayHeader() {
    let result =
      this.getCookie('customerLogin') &&
      JSON.parse(this.getCookie('customerLogin')!);
    this.sheildData = result && result.result.shield;
    this.categoryRoute = '';
    this.locationList = '';
    this.presentUrl = '';
    this.locationService.headerTitle = '';
    let data;
    data = JSON.parse(localStorage.getItem('customerLocation')!);
    if (data && data.formatted_address) {
      this.locationList = this.getGeoCity(data);
    }
    if (result && this.router.url == '/') {
    }
    this.isLocation = true;

    if (this.router.url.includes('/')) {
      const location =
        localStorage.getItem('businessLocation') &&
        JSON.parse(localStorage.getItem('businessLocation'))._id;

      if (this.router.url === '/' && location) {
        this.isBusinessPage = true;
        this.isHomeHeader = false; //home page
      } else {
        this.isBusinessPage = false;
        this.isHomeHeader = true;
      }
      this.categoryRoute = '';
      this.authHeader = false;
      if (this.router.url.includes('my-profile')) {
        this.isHomeHeader = false;
      }
      if (this.router.url.includes('-rating')) {
        this.isHomeHeader = false;
        if (!this.ShowMobile) {
          this.isHomeHeader = true;
        }
        this.categoryRoute = 'Ratings And Reviews';
        this.presentUrl = 'rate';
      }
      if (this.router.url.includes('reviews')) {
        this.isHomeHeader = false;
        this.isBusinessPage = true;
        this.categoryRoute = 'Ratings And Reviews';
        this.presentUrl = 'rate';
      }
      if (this.router.url.includes('shop-detail')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Shop Detail';
        this.presentUrl = 'Shop Detail';
      }
      if (this.router.url.includes('shop')) {
        this.isHomeHeader = false;
        // this.categoryRoute = 'Shop Detail';
        // this.presentUrl = 'Shop Detail';
      }
      if (this.router.url.includes('comment')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Comments';
        this.presentUrl = 'Search Shop';
      }
      if (this.router.url.includes('therapist-detail')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Therapist Detail';
        this.presentUrl = 'Therapist Detail';
      }
      if (this.router.url.includes('select-service')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Select Service';
      }
      if (this.router.url == '/service') {
        this.isHomeHeader = false;
        this.categoryRoute = 'Select Service';
      }
      if (this.router.url == '/booking') {
        this.isBusinessPage = true;
        this.isHomeHeader = false;
        this.categoryRoute = 'Select Service';
      }
      if (this.router.url.includes('level')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Your Level';
      }
      if (this.router.url.includes('your-credit')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Your Credit';
      }
      if (this.router.url.includes('customer-level')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Your Level';
      }
      if (this.router.url.includes('pick-therapist')) {
        if (location) {
          this.isBusinessPage = true;
        } else {
          this.isBusinessPage = false;
        }
        this.isHomeHeader = false;
        this.categoryRoute = 'Pick Therapist';
      }
      if (this.router.url.includes('select-time')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Select Date And Time';
      }
      if (this.router.url.includes('send-request')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Send Request';
      }
      if (this.router.url.includes('confirm-booking')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Confirm Your Booking';
      }
      if (this.router.url.includes('giftcard')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Choose A Giftcard';
        if (location) {
          this.isBusinessPage = true;
        }
      }
      if (this.router.url.includes('receiver-details')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Receiver’s details';
      }
      if (this.router.url.includes('giftcard-letter')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Write A Letter';
      }
      if (this.router.url.includes('delivery-date')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Delivery Time';
      }
      if (this.router.url.includes('delivery-date-picker')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Delivery Time';
      }
      if (this.router.url.includes('purchase-giftcard')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Confirm Purchase';
      }
      if (this.router.url.includes('complete-purchase')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Purchase Complete';
      }
      if (this.router.url.includes('pay')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Payment';
      }
      if (this.router.url.includes('pay_online')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Pay Online';
      }
      if (this.router.url.includes('book-for')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Book For Someone Else';
      }
      if (this.router.url.includes('book-appointment')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Book Appointment';
      }
      if (this.router.url.includes('intake-form')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Intake Form';
      }
      if (this.router.url.includes('all-reviews')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'All Reviews';
        this.presentUrl = 'All Reviews';
      }
      if (this.router.url.includes('recent')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Recent View';
        this.presentUrl = 'Recent View';
      }
      if (this.router.url.includes('search-shop')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Search Shop';
        this.presentUrl = 'Search Shop';
      }
      if (this.router.url.includes('search')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Search now';
        this.presentUrl = 'Search now';
      }
      if (this.router.url.includes('add-location')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Add Location';
        this.presentUrl = 'Add Location';
      }
      if (this.router.url.includes('search-city')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Search City';
        this.presentUrl = 'Search City';
      }
      if (this.router.url.includes('checkout')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Checkout';
        this.presentUrl = 'Checkout';
      }
      if (this.router.url.includes('customer-detail')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Customer Detail';
        this.presentUrl = 'Customer Detail';
      }
      if (this.router.url.includes('mywallet')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'My Wallet';
        this.presentUrl = 'My Wallet';
      }
      if (this.router.url.includes('contacts')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'My Contacts';
        this.presentUrl = 'My Contacts';
      }
      if (this.router.url.includes('my-giftcards')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Giftcards';
        this.presentUrl = 'Giftcards';
      }
      if (this.router.url.includes('select-shop')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Select Shops';
      }
      if (this.router.url.includes('locations')) {
        this.isHomeHeader = false;
        this.isBusinessPage = true;
        this.categoryRoute = 'Select Shops';
      }
      if (this.router.url.includes('scan')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'Scan QR Code';
      }
      if (this.router.url.includes('select-letter')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'select-letter';
      }
      if (this.router.url.includes('send-gift')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'send-gift';
      }
      if (this.router.url.includes('gift-receiver')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'gift-receiver';
      }
      if (this.router.url.includes('gift-preview')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'gift-preview';
      }
      if (this.router.url.includes('gift-payment')) {
        this.isHomeHeader = false;
        this.categoryRoute = 'gift-payment';
      }
    } else {
      console.log('router-->>', this.router.url.includes('auth'));
      this.isHomeHeader = false;
      if (this.router.url.includes('auth')) {
        this.presentUrl = '';
        this.authHeader = true;
      } else if (!this.router.url.includes('auth')) {
        this.presentUrl = this.router.url.split('/')[2];
        this.authHeader = false;
      }

      if (this.router.url.includes('like')) {
        this.isHomeHeader = true;
        this.categoryRoute = false;
      }
      if (this.router.url.includes('schedule')) {
        this.isHomeHeader = true;
        this.categoryRoute = false;
      }
    }

    if (this.route && this.route.queryParams) {
      this.route.queryParams.subscribe((resp) => {
        // console.log(response);
        // if(response && response.therapistName){
        //   this.categoryRoute = response.therapistName;
        //   this.presentUrl = response.therapistName;
        // }

        if (resp && resp.title) {
          this.route_title = resp.title;
          this.sidenav.nativeElement.style.width = '100%';
        } else {
          this.route_title = '';
          // if (resp && resp.category) {//
          //   this.categoryRoute = resp.category;
          // }
          if (resp && resp.therapistName) {
            // console.log(resp.therapistName);
            this.categoryRoute = resp.therapistName;
            // newData = resp.therapistName.split('%');
            // this.categoryRoute = newData[0] + newData[1];
            // console.log(this.categoryRoute);
          }
          if (resp && resp.locationId) {
            if (this.router.url.includes('all-reviews')) {
              this.presentUrl = 'All Reviews';
              this.isHomeHeader = false;
              if (!this.ShowMobile) {
                this.isHomeHeader = true;
                this.authHeader = false;
              }
            }
          }
          if (resp && resp.category && resp.id && resp.categoryId) {
            if (this.router.url.includes('category')) {
              this.isHomeHeader = false;
              this.authHeader = false;
              this.categoryRoute = resp.category;
              this.presentUrl = resp.category;
            }
          }
          this.sidenav.nativeElement.style.width = '0%';
        }
      });
    }

    if (this.router.url.includes('login')) {
      this.isHomeHeader = false;
      this.categoryRoute = null;
      this.authHeader = true;
    }
    if (this.router.url.includes('change-password')) {
      this.isHomeHeader = false;
      this.categoryRoute = 'Change Password';
      this.presentUrl = 'Change Password';
    }
    if (this.router.url.includes('notifications')) {
      this.isHomeHeader = false;
      this.categoryRoute = 'Notifications';
      this.presentUrl = 'Notifications';
    }
    if (this.router.url.includes('my-purchases')) {
      this.isHomeHeader = false;
      this.categoryRoute = 'My Purchases';
      this.presentUrl = 'My Purchases';
    }
    if (this.router.url.includes('event')) {
      console.log(this.router.url.includes('event'));
      this.isHomeHeader = false;
    }
    if (this.router.url.includes('auth')) {
      this.authHeader = true;
      this.isHomeHeader = false;
    }
    if (this.router.url.includes('featured-shops')) {
      this.isHomeHeader = false;
      this.categoryRoute = 'Featured Shops';
      this.presentUrl = 'Featured Shops';
    }
    if (this.router.url.includes('most-booked-shops')) {
      this.isHomeHeader = false;
      this.categoryRoute = 'Most Booked Shops';
      this.presentUrl = 'Most Booked Shops';
    }
    if (this.router.url.includes('recently-viewed-shops')) {
      this.isHomeHeader = false;
      this.categoryRoute = 'Recently Viewed Shops';
      this.presentUrl = 'Recently Viewed Shops';
    }
    if (this.router.url.includes('product/all')) {
      this.isHomeHeader = false;
      this.categoryRoute = 'Products';
      this.presentUrl = 'Products';
    }
    if (this.router.url.includes('product')) {
      this.isHomeHeader = false;
    //   this.categoryRoute = 'Product';
    //   this.presentUrl = 'Product';
    }
    if (this.router.url.includes('product/cart')) {
      this.isHomeHeader = false;
      this.categoryRoute = 'Shopping Cart';
      this.presentUrl = 'Shopping Cart';
    }
    if (this.router.url.includes('/product/rate-product')) {
      this.isHomeHeader = false;
      this.categoryRoute = 'Rate Product';
      this.presentUrl = 'Rate Product';
    }
    if (this.router.url.includes('/freelance')) {
      this.isHomeHeader = false;
      this.categoryRoute = null;
      this.authHeader = true;
    }
    console.log('ROUTE', this.router.url);
    console.log('PRESENT URL', this.presentUrl);
    console.log('CATEGORY ROUTE', this.categoryRoute);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  openLocationComponent() {
    const openLocationRef = this._modal.open(SerachLocationComponent, {});
    openLocationRef.componentInstance.name = 'Location';
  }

  openModelReportBug() {
    this.closeNav();
    const openReportBugRef = this._modal.open(ReportBugPopupComponent, {
      centered: true,
    });
  }

  openModelOnlineSupport() {
    this.closeNav();
    const openOnlineSupportRef = this._modal.open(OnlineSupportPopupComponent, {
      centered: true,
    });
  }

  openModelInviteFriend() {
    this.closeNav();
    const openInviteFriendRef = this._modal.open(InviteFriendPopupComponent, {
      centered: true,
    });
  }

  showSidemenu(type: string) {
    if (this.customerDetails) {
      this.sidenav.nativeElement.style.width = '100%';
      let result =
        this.getCookie('customerLogin') &&
        JSON.parse(this.getCookie('customerLogin')!);
      this.sheildData = result?.result?.shield;
    }
  }

  closeNav() {
    this.hideNavbar();
  }

  navigateTo(path?: string) {
    console.log(path);
    this.hideNavbar();
    if (path) this.router.navigateByUrl(path);
  }

  navigateToGiftCard() {
    this.hideNavbar();
    this.router.navigateByUrl('/my-giftcards');
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  deleteCookie(name) {
    if (document.domain === 'localhost') {
      document.cookie =
        name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    } else {
      document.cookie =
        name +
        '=; domain=.thebookus.com; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }

  logoutUserModal(logoutModal: any) {
    this.hideNavbar();
    this._modal.open(logoutModal, { centered: true });
  }
  logoutUser() {
    let device = JSON.parse(localStorage.getItem('deviceInfo'));
    this.service.post('logout', device).subscribe((res) => {});
    this.hideNavbar();
    localStorage.removeItem('customerLogin');
    localStorage.removeItem('customerToken');
    this.deleteCookie('customerLogin');
    this.deleteCookie('customerToken');
    localStorage.removeItem('deviceInfo');
    this._modal.dismissAll();
    setTimeout(() => {
      this.router.navigateByUrl('auth/login').then(() => {
        window.location.reload();
      });
    }, 1000);
  }

  navigateToHome(url: string) {
    this.locationService.headerTitle = '';
    this.goBack();
  }

  hideNavbar() {
    this.sidenav.nativeElement.style.width = '0%';
  }

  goBack() {
    this.location.back();
  }

  handleEvent(event: any, content: any) {
    if (event.action == 'done') {
      this.startBookingTime = false;
      this._modal.open(content, { centered: true });
    }
  }

  handleServiceEvent(event: any, content: any) {
    if (event.action == 'done') {
    }
  }

  openServiceStatusPopup(content2: any, appointment?: any) {
    this.todayAppointment.forEach((element: any) => {
      element.countdown = this.getServiceTime(element.endTime);
    });
    if (appointment) {
      this.selectedAppointmentData = appointment;
    } else {
      if (this.todayAppointment.length > 1) {
        this.selectedAppointmentData = undefined;
      } else {
        this.selectedAppointmentData = this.todayAppointment[0];
      }
    }
    this.openStartTimerPopup(content2);
  }

  startAppointment() {
    this.service
      .get('customers/set_start_time/' + this.selectedAppointmentData._id)
      .subscribe((res: any) => {
        clearInterval(this.inter);
        this.selectedAppointmentData = res.result;
        this.selectedAppointmentData.countdown = this.getServiceTime(
          this.selectedAppointmentData.endTime
        );
        this.openStartTimerPopup(this.content2, true);
      });
  }

  openStartTimerPopup(content2: any, isOpent?: boolean) {
    this.nomoreTime = false;
    if (this.selectedAppointmentData) {
      let durationMin =
        Number(this.selectedAppointmentData.duration.hour * 60) +
        Number(this.selectedAppointmentData.duration.min);
      this.selectedAppointmentData.durationMin = Number(durationMin);
      let timeout = this.getServiceTime(
        this.selectedAppointmentData.endTime,
        this.selectedAppointmentData.startTime
      );
      this.time = this.getServiceTime(this.selectedAppointmentData.endTime);
      let total =
        timeout - this.getServiceTime(this.selectedAppointmentData.endTime);
      this.inter = setInterval(() => {
        total++;
        this.time--;
        if (total >= timeout || this.time == 0) {
          if (this.time == 0) {
            this._modal.dismissAll();
          }
          this.time = 0;
          clearInterval(this.inter);
        }
        this.percentage = Math.ceil((total * 100) / timeout);
      }, 1000);
    }

    if (!isOpent) {
      this._modal.open(content2, { windowClass: 'full-modal' });
    }
  }

  selectAnotherTimeSlot() {
    this.router.navigate(['/select-time']);
    this._modal.dismissAll();
  }

  // routing
  goToScore() {
    this.router.navigate(['/nav/my-score']);
  }

  navigateToHomePage() {
    this.locationService.headerTitle = '';
    this.router.navigate(['/']);
  }

  navigateToMainPage() {
    window.location.href = 'https://home.thebookus.com';
  }

  setUserLocation(coordinates?) {
    this.customerLocation = JSON.parse(
      localStorage.getItem('customerLocation')!
    );
    if (coordinates) {
      this.locationService.setCurrentCoordinates(coordinates);
    } else {
      this.userLocation = this.getGeoCity(this.customerLocation);
      this.setCurrentCoordinates(this.customerLocation);
    }
    this.subscription = this.locationService
      .getUserLocation()
      .subscribe((res: any) => {
        console.log(res);
        if (res && res.latPosition && res.logPosition) {
          let customerLatLongAddress = JSON.parse(
            localStorage.getItem('customerLatLongAddress')!
          );
          this.userLocation = customerLatLongAddress.address;
          let coordinatess = {
            lat: customerLatLongAddress.latPosition,
            lng: customerLatLongAddress.logPosition,
          };
          this.locationService.setCurrentCoordinates(coordinatess);
        }
      });
  }

  setCurrentCoordinates(customerLocation: any) {
    const coordinates =
      customerLocation?.geometry?.location ||
      customerLocation?.geo_location?.coordinates;
    this.locationService.setCurrentCoordinates(coordinates);
  }

  getGeoCity(results: any) {
    // console.log(results);
    if (!results) {
      return null;
    }
    if (!results.address_components) {
      return results.locality;
    }

    let matches = results.address_components.filter((address_component: any) =>
      ['locality', 'colloquial_area', 'country'].some(
        (word) => ~address_component.types.indexOf(word)
      )
    );
    if (!matches || !matches.length) {
    } else {
      return matches[0].short_name;
    }
    return '';
  }
  goToSchedule() {
    this.router.navigate(['/schedule']);
  }

  goToFavourite() {
    this.router.navigate(['/like']);
  }

  goToNotification() {
    this.router.navigate(['/notifications']);
  }

  closeContent2() {
    if (this.inter) {
      clearInterval(this.inter);
    }
    this._modal.dismissAll();
  }

  getServiceTime(date: any, start?: any) {
    var t1 = new Date(date);
    var t2 = start ? new Date(start) : new Date();
    var dif = t1.getTime() - t2.getTime();
    if (dif < 0) {
      return 0;
    }
    return dif / 1000;
  }

  openMassageControlPopup(type: any) {
    if (type === 'add-more-time') {
      this.service
        .get('customers/check_staff_time/' + this.selectedAppointmentData._id)
        .pipe(
          map((arr: any) => {
            return (
              arr.result.filter((item: any) => {
                if (item.time < this.selectedAppointmentData.durationMin) {
                  return false;
                }
                return (
                  item.price -
                    (this.selectedAppointmentData.special_price ||
                      this.selectedAppointmentData.price) >
                  0
                );
              }) || []
            );
          })
        )
        .subscribe((res: any) => {
          if (res && res.length > 0) {
            let modalRef: any = this._modal.open(MassageControlComponent, {
              size: 'md',
              centered: true,
            });
            modalRef.componentInstance.type = type;
            modalRef.componentInstance.data = {
              appointment: this.selectedAppointmentData,
              result: res,
            };
            modalRef.result.then((result: any) => {
              if (result && result.result) {
                this.selectedAppointmentData = result.result;
                clearInterval(this.inter);
                this.openStartTimerPopup(this.content2, true);
              }
            });
          } else {
            this.nomoreTime = true;
          }
        });
    } else if (type === 'stop-service') {
      let modalRef: any = this._modal.open(MassageControlComponent, {
        size: 'md',
        centered: true,
      });
      modalRef.componentInstance.type = type;
      modalRef.componentInstance.data = this.selectedAppointmentData;
      modalRef.result.then((result: any) => {
        if (result && result.result) {
          clearInterval(this.inter);
          this.selectedAppointmentData = undefined;
          this.startedAppointments();
          this._modal.dismissAll();
        }
      });
    } else if (type == 'change-therapist') {
      this.service
        .get(
          'customers/avilable_therapist_list/' +
            this.selectedAppointmentData._id
        )
        .subscribe((res: any) => {
          let modalRef: any = this._modal.open(MassageControlComponent, {
            size: 'md',
            centered: true,
          });
          modalRef.componentInstance.type = type;
          modalRef.componentInstance.data = this.selectedAppointmentData;
          modalRef.componentInstance.therapisList = res.result;
          modalRef.result.then((result: any) => {
            clearInterval(this.inter);
            this.selectedAppointmentData = result;
            this.openServiceStatusPopup(this.content2, result);
          });
        });
    } else {
      let modalRef: any = this._modal.open(MassageControlComponent, {
        size: 'md',
        centered: true,
      });
      modalRef.componentInstance.type = type;
      modalRef.result.then((result: any) => {});
    }
  }
  goToGiftCard() {
    this.router.navigate(['/nav/my-backpack']);
  }
  searchShops() {
    this.searchShopEvent$
      .pipe(debounceTime(100), distinctUntilChanged())
      .subscribe((res: any) => {
        if (this.copyShopList.length == 0) {
          this.scheduleService
            .search_company('search=' + res)
            .pipe(distinctUntilChanged())
            .subscribe(
              (result: any) => {
                this.shopList = result.result;
                this.copyShopList = _.cloneDeep(this.shopList);
              },
              (err) => {
                console.log(err);
              }
            );
        } else {
          this.shopList = this.copyShopList.filter((event: any) => {
            return event.company.businessName.toLowerCase().includes(res);
          });
        }
      });
  }

  startedAppointments() {
    this.service
      .get(
        'customers/today_appointment?clientId=' + this.customerDetails.client
      )
      .subscribe((res: any) => {
        res.result.forEach((element: any) => {
          element.countdown = this.getServiceTime(element.endTime);
        });
        if (res.result.length > 0) {
          this.todayAppointment = res.result;
          if (this.todayAppointment && this.todayAppointment.length > 1) {
          } else {
            this.selectedAppointmentData = this.todayAppointment[0];
          }
          this.openStartTimerPopup(this.content2);
        } else {
        }
      });
  }

  navigateShopDetail(shop: any) {
    this.searchShopList = shop.company.businessName;
    this.router.navigate(['/shop-details'], {
      queryParams: {
        locationId: shop._id,
        ownerId: shop.ownerId,
        shopName: shop.name,
        categoryId:
          shop.categoryId && shop.categoryId.length > 0
            ? shop.categoryId[0]
            : '',
      },
    });
  }

  navigateToSearchCity() {
    this._modal.open(LocationSelectionPopupComponent, {
      centered: true,
    });
  }

  searchShop(e) {
    if(e) {
      this.locationService.setUserSearch(this.searchShopsText);
      let currentUrl = this.router.url;
      if (currentUrl == '/') {
        this.router.navigate(['/search-shop']);
      }
    } else {
      this.locationService.setUserSearch(this.searchShopsText);
      // this.router.navigate(['/']);
    }
  }

  setSearchShop() {
    if (this.searchShopsText) {
      let currentUrl = this.router.url;
      if (currentUrl == '/') {
        this.router.navigate(['/search-shop']);
      }
      this.locationService.setUserSearch(this.searchShopsText);
    } else {
      this.router.navigate(['/']);
    }
  }
  showLists = false;
  notifList() {
    this.showLists = !this.showLists;
  }
  navigateToSignIn() {
    this.router.navigate(['auth/login']);
  }

  navigateToSignUp() {
    this.router.navigate(['auth/register']);
  }

  navigateToPage(page: string): void {
    this.router.navigateByUrl(`/${page}`);
  }

  toggleScanner() {
    this.router.navigate(['/nav/scanner']);
  }
  updateUrl(e: any) {
    e.target.src = 'assets/images/carbon_user-avatar-filled.svg';
  }
  userImage(e) {
    let gender = this.customerDetails?.result?.gender;
    let src = '';
    if(gender === 'Male') {
      src = 'assets/images/male-user.svg';
    } else if(gender === 'Female') {
      src = 'assets/images/female-user.svg';
    } else {
      src = 'assets/images/carbon_user-avatar-filled.svg';
    }
    return e.target.src = src;
  }
}

