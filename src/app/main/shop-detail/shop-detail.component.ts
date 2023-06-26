import { ChangeDetectorRef, Component, Input, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { BookingService } from 'src/app/services/booking.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { filter } from 'lodash';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { NgbDateStruct, NgbDate, NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentComponent } from '../comment/comment.component';
import { HomeServiceService } from '../home/home-service.service';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { GiftcardService } from 'src/app/main/giftcard/giftcard.service';
import { environment } from 'src/environments/environment'
import { fromEvent, Subscription } from 'rxjs';
import { element } from 'protractor';
import { Location } from '@angular/common';
import { UiService } from 'src/app/services/ui.service';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class ShopDetailComponent implements OnInit {
  userData: any;
  locationId: any;
  newDate: any;
  // shopDetails:any = {profileImage: [{img: '../../../assets/images/shop-img.jpg'}, {img: '../../../assets/images/shop-img.jpg'}]};
  shopDetails:any;
  onlineGiftcard: any;
  companyName:any;
  companyStreet:any;
  therapist:any;
  totalStar:any
  star_count:any
  // public isCollapsed = false;
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
  selectedServiceObj: any;
  noImage: any;
  isLoading: boolean = false;
  selectedTherapistIndex: any;
  businessLocation: any;
  isReadMore = false;
  // isCollapsed = true;
  isContentToggled: boolean = false;
  // limit = 40;

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: false,
    autoHeight: true,
    autoWidth: true,
    nav: false,
    dots: false,
    navText: [
       "<i class='fa fa-chevron-left'></i>",
       "<i class='fa fa-chevron-right'></i>"
    ],
    responsive: {
      0: {
        items: 1,
        dots: true,
        nav: false
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    },
    items: 1
  };
  openImages: boolean = false;
  ShopImgsDesktop: OwlOptions = {
    loop: false,
    autoplay: false,
    center: false,
    autoHeight: true,
    autoWidth: true,
    nav: true,
    dots: false,
    items: 4,
    margin: 20,
    navText: [
       "<i class='fa fa-chevron-left'></i>",
       "<i class='fa fa-chevron-right'></i>"
    ],
  };
  ShopImgsFullPage: OwlOptions = {
    loop: false,
    autoplay: false,
    center: false,
    autoHeight: true,
    autoWidth: true,
    nav: true,
    dots: false,
    items: 1,
    margin: 20,
    navText: [
       "<i class='fa fa-chevron-left'></i>",
       "<i class='fa fa-chevron-right'></i>"
    ],
  };
  activeCategory: any = '';
  servicesCarousel: OwlOptions = {
    nav: true,
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: false,
    autoplayTimeout: 2000,
    navSpeed: 700,
    navText:["<i class='bi bi-arrow-left'></i>","<i class='bi bi-arrow-right'></i>"],
  }
  facilities = [
    {name: 'Online Payment'},
    {name: 'Air Condition'},
    {name: 'Shower'},
    {name: 'toilet'},
    {name: 'Tea'},
    {name: 'Music'},
    {name: 'Wi-Fi'},
  ];
  paymentMethod = [
    {img: 'assets/images/shop/payment-method/credit-card.svg'},
    {img: 'assets/images/shop/payment-method/cash.svg'},
    {img: 'assets/images/shop/payment-method/master-card.svg'},
    {img: 'assets/images/shop/payment-method/gift-card.svg'},
    {img: 'assets/images/shop/payment-method/american-express.svg'},
    {img: 'assets/images/shop/payment-method/payafter.svg'},
    {img: 'assets/images/shop/payment-method/visa.svg'},
    {img: 'assets/images/shop/payment-method/plus.svg'},
  ]
  // Calendar vars
  model: NgbDateStruct | undefined;
  date: {year: number, month: number} | undefined;
  getSelectedDate: any;
  currectDays: any;
  disabledDates: NgbDateStruct[] = [];
  loadDisabledDates = false;
  loadTimeslots = false;
  loadCalendar = false;
  //calendar settings
  displayMonths = 1;
  navigation = 'arrows';
  showWeekNumbers = false;
  outsideDays = 'visible';
  // slots
  newTime = [
    {
      slot : "2021-07-12T08:53:26.666Z"
    },
    {
      slot : "2021-07-12T08:53:26.666Z"
    },
    {
      slot : "2021-07-12T08:53:26.666Z"
    },
    {
      slot : "2021-07-12T08:53:26.666Z"
    },
    {
      slot : "2021-07-12T08:53:26.666Z"
    },
    {
      slot : "2021-07-12T08:53:26.666Z"
    },
  ];
  selectedTherapistObj:any;
  subscription: Subscription;
  giftcardDetails: any;
  replyArr: any = [];
  ourShops: any;
  isBusinessPage = false;
  from_home_page = false;
  ScreenWidth!: number;
  ScreenHeight!: number;
  isMobile: boolean = false;
  currency = {name: 'USD', symbol: '$'};
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.ScreenWidth = event.target.innerWidth;
    this.ScreenHeight = event.target.innerHeight;
    if (this.ScreenWidth <= 768) {
      this.isMobile = true;
    } else if (this.ScreenWidth < 1024) {
      this.isMobile = false;
    }
  }
  constructor(
    private activatedRoute: ActivatedRoute ,
    private httpService: ApiServicesService,
    private router:Router,
    private location: Location,
    private cdref: ChangeDetectorRef,
    private authService:AuthServiceService,
    private modalService: NgbModal,
    private bookingService: BookingService,
    private homeService :HomeServiceService,
    private gc: GiftcardService,
    private _ui: UiService,
    private _toast: ToasterService
  ) {
    let previous_url = this.router.getCurrentNavigation()?.extras?.state?.previous_url
    if (previous_url === '/') {
      this.from_home_page = true;
    }
  }

  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();
    this.userData = this.authService.getUserData();
    this.getShopId();
    this.loadMinDate();
    this.giftcard()
    this.userFirstTime();
    if(this.router.url === '/') {
      this.isBusinessPage = true;
    } else {
      this.isBusinessPage = false;
    }
    console.log("route log", this.router.url, this.isBusinessPage)
  }
  back() {
    this.location.back();
  }
  public scrolled = 0;
  onScroll(e) {
    this.scrolled = e.target.scrollTop;
    console.log(this.scrolled);
  }
  
  giftcard() {
    this.subscription = this.gc.getGiftcardDetails()
    .subscribe((details: any) => {
      this.giftcardDetails = details;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  loadMinDate() {
    const current = new Date();
    this.currectDays = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }
  imgLink(e, _for?) {
    if(e === undefined || e === null) {
      if(_for === 'service') {
        return './assets/images/service.png';
      }
    } else {
      let splitLink = e.split("/");
      return `${environment.image_url}/uploads/${splitLink[splitLink.length - 1]}`;
    }
  }
  getShopId(){
    this.isLoading = true;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.activatedRoute.params
    .subscribe(params => {
      this.locationId = params['locationId'];
      if(this.userData) {
        this.getLoyalty();
      }
    });
    const location = localStorage.getItem('businessLocation') && JSON.parse(localStorage.getItem('businessLocation'));
    if(!this.locationId && location && location._id) {
      this.businessLocation = location;
      this.locationId = location._id;
    } else {
      localStorage.removeItem('businessLocation')
    }
    this.getShopDetails()
    this.getShopRating()
  }
  public loyaltyPoints = 0;
  getLoyalty() {
    this.httpService.get(`my_loyalty_points?id=${this.userData?.client}`).subscribe(
      res => {
        console.log(res);
        res.result.forEach(obj => {
          if(obj.shopPointsList[0].locationId._id === this.locationId) {
            this.loyaltyPoints = obj.shopPointsList[0].have
            console.log(obj.shopPointsList[0].locationId._id);
          }
        });
      },
      err => {

      }
    )
  }
  formatAMPM(date: any) {
    date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    var strTime = hours + ':' + minutes + ampm;
    return strTime;
  }
  shopCoverImg: any = '';
  currectSlide: any;
  getShopDetails() {
    this.httpService.get(`get_shop_detail?locationId=${this.locationId}&detail=true`).subscribe( res => {
      this.isLoading = false;
      this.shopDetails = res.result;
      this.shopDetails.locationId = this.locationId;
      this.ownerId = this.shopDetails.ownerid;
      this.currectSlide = this.shopDetails.profileImage[0]?._id
      if(this.shopDetails.currency) {
        this.currency = this.shopDetails.currency;
      }
      this.shopDetails.profileImage.forEach(element => {
        if(element?.isCoverPhoto == true) {
          console.log(element?.img)
          this.shopCoverImg = element?.img;
        }
      });
      this.getServices();
      this.getProducts();
      this.onlineGiftcard = res.result.onlineGiftCard;
      this.shopDetails.availibity = 'Not Available';
      if(this.shopDetails && this.shopDetails.openHours && this.shopDetails.openHours.length) {
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDay = weekDays[new Date().getDay()];
        for (var i = 0; i < this.shopDetails.openHours.length; i++) {
          const openHour = this.shopDetails.openHours[i];
          if (openHour.day_of_week = currentDay) {
            if(!this.isMobile){
              if(openHour.start != '' && openHour.end != ''){
                this.shopDetails.availibity = currentDay + ' ' + this.formatAMPM(openHour.start) + ' - ' + this.formatAMPM(openHour.end);
              }else {
                this.shopDetails.availibity = `${currentDay} - Closed`;
              }
            }
            else{
              this.shopDetails.availibity = this.formatAMPM(openHour.start) + ' - ' + this.formatAMPM(openHour.end);
            }
            break;
          }
        }
      }

      if(this.shopDetails.reviews && this.shopDetails.reviews.length > 3) {
        this.shopDetails.reviews = (this.shopDetails.reviews).slice(0, 3);
      }

      if(this.shopDetails.services && this.shopDetails.services.length > 3) {
        this.shopDetails.services = (this.shopDetails.services).slice(0, 3);
      }
      let ourShop = this.shopDetails.ourShop;
      ourShop.sort((a,b) => b.onlineBooking - a.onlineBooking);
      this.ourShops = ourShop;
      
      if (this.shopDetails && this.shopDetails.favShop.includes(this.locationId)) {
        this.isFavouriteShop = true;
      }
    },
    (err) => {
      this.isLoading = false;
    })
  };
  serviceGroupList: any = [];
  getServices() {
    this.httpService.get(`get_services?shop_owner=${this.ownerId}&locationId=${this.locationId}&pwa=true`)
    .subscribe(res => {
      let serviceGroup = [];
      res.group_name.forEach(group => {
        let obj = {groupName: group, services: []};
        res.result.forEach(service => {
          if(group == service.name){
            obj.services.push(service)
          }
        })
        serviceGroup.push(obj);
      });
      this.serviceGroupList = serviceGroup;
      this.activeCategory = serviceGroup[0]?.groupName;
      this.selectedCategory = serviceGroup[0];
      this._ui.setHomeComplete(true);
    });
  }
  selectedCategory: any = []
  selectCategory(e) {
    console.log(e)
    this.activeCategory = e;
    this.serviceGroupList.forEach(element => {
      if(element.groupName == e) {
        this.selectedCategory = element;
        console.log(this.selectedCategory);
      }
    });
  };
  overallRating: any;
  percentRatings: any;
  totalshopRating: any;
  getShopRating() {
    this.httpService.get(`shop_review/${this.locationId}?recentRating=true`)
    .subscribe( res => {
      this.totalshopRating = res.result_pageInfo.collectionSize;
      this.overallRating = res?.location_overall[0].rating;
      if(this.overallRating && this.overallRating.stars) {
        this.overallRating.star_count = this.overallRating.stars.five_star_count + this.overallRating.stars.four_star_count + this.overallRating.stars.three_star_count + this.overallRating.stars.two_star_count + this.overallRating.stars.one_star_count
        this.percentRatings = {
          five_star: ((this.overallRating.stars.five_star_count * 100) / this.overallRating.star_count).toFixed(1),
          four_star: ((this.overallRating.stars.four_star_count * 100)/ this.overallRating.star_count).toFixed(1),
          three_star: ((this.overallRating.stars.three_star_count * 100)/ this.overallRating.star_count).toFixed(1),
          two_star: ((this.overallRating.stars.two_star_count * 100)/ this.overallRating.star_count).toFixed(1),
          one_star: ((this.overallRating.stars.one_star_count * 100)/ this.overallRating.star_count).toFixed(1)
        }
        console.log(this.percentRatings)
      }
    });
  }
  products: any = [];
  getProducts() {
    this.httpService.get(`products?ownerId=${this.ownerId}`)
    .subscribe( res => {
      res.result.forEach(product => {
        if(product.stocks.locationStockList) {
          product.stocks.locationStockList.forEach(stock => {
            if(stock.location._id == this.locationId && stock.stockQuantity >= 1) {
              let data = {
                name: product?.name,
                barcode: product?.barcode,
                primarySku: product?.primarySku,
                description: product?.description,
                images: product?.productImages,
                retailPrice: product?.retailPrice,
                specialPrice: product?.specialPrice,
                supplyPrice: product?.supplyPrice,
                stocks: stock?.stockQuantity,//Total stocks for currect location
                stockTotal: stock?.stockTotal,//total stocks for all location
                supplier: product?.supplier,
                sold: product?.sold,
                _id: product?._id,
                enableRetailSales: product?.enableRetailSales,
              };
              if(product?.enableOnlineSale) {
                this.products.push(data);
              }
            }
          });
        }
      });
      console.log(this.products)
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
      this.httpService.delete(`shop/${this.locationId}`).subscribe(res => {
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
      this.httpService.put(`update_profile?id=${this.userData.result._id}&clientId=${this.userData.client}`, payload)
        .pipe(distinctUntilChanged())
        .subscribe(res => {
        if (res && res.status == 200) {
          this.isFavouriteShop = true;
        }
      });
    }
  }

  navigateToReview() {
    if(this.businessLocation) {
      this.router.navigate(['/reviews']);
    } else {
      this.router.navigate(['/shop-rating', this.locationId]);
    }
  }

  selectedService(item: any){
    let time = 0;
    if (this.selectedServiceObj) {
      this.selectedServiceObj = null;
      time = 1000;
    }
    setTimeout(() => {
      this.selectedServiceObj = {
        locationId:             this.locationId,
        ownerId:                this.ownerId,
        shopName:               this.shopName,
        categoryId:             this.categoryId,
        loyalityPoint:          this.loyaltyPoints,
        serviceId:              item.services._id,
        serviceTime:            item.services.pricing_option.duration,
        serviceName:            item.services.name,
        servicePrice:           item.services.pricing_option.price,
        servicePricingName:     item.services.pricing_option.specialPriceFor,
        loyaltyPointCanRedeem:  item.services.pricing_option.loyaltyPointCanRedeem,
        loyaltyPointRecieve:    item.services.pricing_option.loyaltyPointRecieve,
      };
      setTimeout(() => {
        document.querySelector('.therapist-block .bottom-therapist-block')!.scrollIntoView({
          behavior: 'smooth'
        });
      }, 1000);
    }, time);
  }

  navigateToTherapistDetail() {
    this.router.navigate(['/therapist-detail']);
  }

  gotoGiftCardPage(){
    if (this.onlineGiftcard) {
      this.giftcardDetails.shopDetails = this.shopDetails;
      this.giftcardDetails.shopDetails.locationId = this.locationId;
      this.gc.setGiftcardDetails(this.giftcardDetails)
      this.router.navigate(['/giftcard']);
    }
  }

  setDefaultUserPic(e: any, gender: string, review) {
    if (review && review.anonymous) {
      if (gender === 'Male') {
        e.target.src = './assets/images/anonymous-male.svg';
      } else {
        e.target.src = './assets/images/anonymous-female.svg';
      }
    }
    else {
      if (gender === 'Male') {
        e.target.src = './assets/images/male-user.svg';
      } else {
        e.target.src = './assets/images/female-user.svg';
      }
    }

  }

  setDefaultTherapistPic(e: any, gender: string) {
    if(gender === 'Male') {
      e.target.src = './assets/images/male-therapist.svg';
    } else {
      e.target.src = './assets/images/female-therapist.svg';
    }
  }

  updateUrl(e: any) {
    e.target.src = './assets/images/service.png';
  }
  
  selectTherapist(index: any) {
    this.selectedTherapistIndex = index;
  }

  selectService(item: any, pricing_option:any) {
    const replaceHour = pricing_option.duration.replace(/1h\b/g, "60"); // Replace 1h -> 60
    const replaceMin = replaceHour.replace(/min\b/g, ""); // Replace remove min
    const replaceSpace = replaceMin.split(/[ ,]+/).map(s => Number(s)); //Split string with , and convert to number
    const getDuration = replaceSpace.reduce((a, b) => a + b); // Add up all numbers
    const duration = getDuration;
    let serviceData = {
      serviceId: item?.services?._id,
      serviceDuration: duration,
      serviceTime: pricing_option?.duration,
      serviceName: item?.services?.name,
      serviceSpecialPrice: pricing_option?.specialPrice,
      servicePrice: pricing_option?.price,
      servicePricingName: pricing_option?.specialPriceFor,
      loyaltyPointCanRedeem: pricing_option?.loyaltyPointCanRedeem,
      loyaltyPointRecieve: pricing_option?.loyaltyPointRecieve
    }
    this.bookingService.bookingData.service = serviceData;
  }
  bookThisService() {}
  book(therapist?) {
    
      let bookingDetails: any = {
        shop: {
          locationId: this.locationId,
          ownerId: this.shopDetails?.ownerid,
          name: this.shopDetails?.locationName,
          loyaltyPoints: this.loyaltyPoints,
          rating: this.shopDetails?.locationRating,
          selectTherapist: this.shopDetails?.onlineBookingRules?.selectTherapist,
          openHours: this.shopDetails.openHours,
          loyaltyPointsOnReview: this.shopDetails.loyaltyPointsOnReview,
          currency: this.shopDetails.currency,
          editTime: this.shopDetails.editTime,
          address: {
            bldg: this.shopDetails?.companyBuilding,
            street: this.shopDetails?.companyStreet,
            city: this.shopDetails?.companyCity,
            state: this.shopDetails?.companyState,
            zip: this.shopDetails?.companyZip,
          },
          image: this.shopDetails.profileImage,
        }
      }
      if(therapist) {
        bookingDetails.therapist = {
          _id: therapist._id,
          firstName: therapist.firstName,
          lastName: therapist.lastName,
          image: therapist?.image,
          gender: therapist?.gender,
          requested_staff: true
        }
      }
      if (this.userData && !this.userData?.result?.verified) {
        this._toast.error("Booking requires varified account please verify your account first.");
        return;
      }
      this.bookingService.bookingData = bookingDetails
      this.router.navigate(['/service']);
      this.modalService.dismissAll();
    
  }
  bookTherapist(therapist: any) {
    const bookingDetails: any = {
      shop: {
        locationId: this.locationId,
        ownerId: this.shopDetails?.ownerid,
        name: this.shopDetails?.locationName,
        loyaltyPoints: this.loyaltyPoints,
        rating: this.shopDetails?.locationRating,
        address: {
          bldg: this.shopDetails?.companyBuilding,
          street: this.shopDetails?.companyStreet,
          city: this.shopDetails?.companyCity,
          state: this.shopDetails?.companyState,
          zip: this.shopDetails?.companyZip,
        },
        image: this.shopDetails.profileImage,
      },
      therapist: {
        _id: therapist._id,
        firstName: therapist.firstName,
        lastName: therapist.lastName,
        image: therapist?.image,
        gender: therapist?.gender
      }
    }
    this.bookingService.setBookingDetails(bookingDetails);
    if(this.businessLocation) {
      this.router.navigate(['/therapist', (therapist?.firstName).toLowerCase() + '-' + therapist?._id]);
    } else {
      this.router.navigate(['/therapist-detail', therapist?._id]);
    }
  }

  customerDetail(client:any){
    if(client.customerId){
      this.router.navigate(['/customer-detail/' + client.customerId._id]);
    }
  }
  navigateToSelectService() {
    this.router.navigate(['/service']);
  }
  showPopup(viewAllContent: any, _for?) {
    if (_for == 'shopImages') {
      this.modalService.open(viewAllContent, { size: 'xl', centered: true });
    } else {
      this.modalService.open(viewAllContent, { centered: true });
    }
  }

  likeComment(_id: any) {
    console.log(_id)
    if(!this.userData){
      const modal = this.modalService.open(LoginPopupComponent,{
        centered : true
      })
    return;
    }
    let data =
    {
      "review_id": _id,
      "like": {
        
        "customerId": this.userData.result._id
      }
    }
    if(this.shopDetails.reviews.length){
      this.shopDetails.reviews.forEach(element => {
        if(element._id == _id){
        if(element.like.length){
          let data : any = [];
           data = element.like;
          element.like.forEach(ele => {
            var newThis = this;
            const index = _.findIndex(data, function (i) {
              return (
                ele.customerId._id == newThis.userData.result._id
              );
            });
            if(index == -1){
              element.like.push({
                customerId : {_id : this.userData.result._id}
              })
              if(element.dislike.length){
                let newData : any = [];
                newData = element.dislike;
                element.dislike.forEach(ele => {
                  var newThis = this;
                  const index = _.findIndex(newData, function (i) {
                    return (
                      ele.customerId._id == newThis.userData.result._id
                    );
                  });
                  if(index === -1){
                    // element.like.push({
                    //   customerId : {_id : this.userData.result._id}
                    // })
                  }else {
                    element.dislike = element.dislike.splice(index,1);
                  }
                });
              }
            }else {
              element.like = element.like.filter((item)=>{item.customerId._id != this.userData.result._id}); 
            }
          });
  
        }else{
          element.like.push({
            customerId : {_id : this.userData.result._id}
          }) 
          if(element.dislike.length){
            let newData : any = [];
            newData = element.dislike;
            element.dislike.forEach(ele => {
              var newThis = this;
              const index = _.findIndex(newData, function (i) {
                return (
                  ele.customerId._id == newThis.userData.result._id
                );
              });
              if(index === -1){
                // element.like.push({
                //   customerId : {_id : this.userData.result._id}
                // })
              }else {
                element.dislike = element.dislike.filter((item)=>{item.customerId._id != this.userData.result._id}); 
                // element.dislike.pop();
              }
            });
          }
        }
  
        // if(element.like.length == 0){
        //   element.like.push({
        //     customerId : {_id : this.userData.result._id}
        //   })
        // }
      }
      });
    }
    this.httpService.post(`reviewComment`, data).subscribe((res: any) => {
      if (res.status == 200) {
        // this.getShopDetails();
      }
      // this.getShopDetails();
    })
  }

  //Dislike Comment
  dislikeComment(_id: any) {
    if(!this.userData){
      const modal = this.modalService.open(LoginPopupComponent,{
        centered : true
      })
    return;
    }
    let data =
    {
      "review_id": _id,
      "dislike": {
        
        "customerId": this.userData.result._id
      }
    }
    if(this.shopDetails.reviews.length){
      this.shopDetails.reviews.forEach(element => {
        if(element._id == _id){
        if(element.dislike.length){
          let data : any = [];
           data = element.dislike;
          element.dislike.forEach(ele => {
            var newThis = this;
            const index = _.findIndex(data, function (i) {
              return (
                ele.customerId._id == newThis.userData.result._id
              );
            });
            if(index == -1){
              element.dislike.push({
                customerId : {_id : this.userData.result._id}
              })
              if(element.like.length){
                let newData : any = [];
                newData = element.like;
                element.like.forEach(ele => {
                  var newThis = this;
                  const index = _.findIndex(newData, function (i) {
                    return (
                      ele.customerId._id == newThis.userData.result._id
                    );
                  });
                  if(index === -1){
                    // element.like.push({
                    //   customerId : {_id : this.userData.result._id}
                    // })
                  }else {
                    element.like = element.like.splice(index,1);
                  }
                });
              }
            }else {
              element.dislike = element.dislike.filter((item)=>{item.customerId._id != this.userData.result._id}); 
            }
          });
  
        }else{
          element.dislike.push({
            customerId : {_id : this.userData.result._id}
          }) 
          if(element.like.length){
            let newData : any = [];
            newData = element.like;
            element.like.forEach(ele => {
              var newThis = this;
              const index = _.findIndex(newData, function (i) {
                return (
                  ele.customerId._id == newThis.userData.result._id
                );
              });
              if(index === -1){
                // element.like.push({
                //   customerId : {_id : this.userData.result._id}
                // })
              }else {
                element.like = element.like.filter((item)=>{item.customerId._id != this.userData.result._id}); 
                // element.dislike.pop();
              }
            });
          }
        }
  
        // if(element.like.length == 0){
        //   element.like.push({
        //     customerId : {_id : this.userData.result._id}
        //   })
        // }
      }
      });
    }
    this.httpService.post(`reviewComment`, data).subscribe((res: any) => {
      // this.getShopDetails();
    })
  }

  checkLikeDislike(d: any, type?:any){
    let reviewLikeId = _.map(d.like, 'customerId._id');
    let reviewDislikeId = _.map(d.dislike, 'customerId._id');

    if(!this.userData)
    return;
    
    switch (type) {
      case 'like':
        if (reviewLikeId.indexOf(this.userData.result._id) >=0) {
          return true;
        }
        break;
      case 'dislike':
        if (reviewDislikeId.indexOf(this.userData.result._id) >=0) {
          return true;
        }
        break;

      default:
        return '';
    }
  }

  openScrollableContent(review:any) {
    this.router.navigateByUrl('/comment/' + review._id);
    this.homeService.sendCommentData(review);
    // const openLocationRef = this.modalService.open(CommentComponent, { scrollable: true });
    // openLocationRef.componentInstance.name = 'Comments';
    // openLocationRef.componentInstance.data = review;
    // openLocationRef.result.then(
    //   result => {
    //     this.getShopDetails();
    //   },
    //   reason => {
    //     this.getShopDetails();
    //   })
  }

  navigateToSelectShops() {
    if(this.businessLocation) {
      this.router.navigate(['/locations']);
    } else {
      this.router.navigate(['/select-shop', this.shopDetails?.ownerid])
    }
  }
  bookus = false;
  userFirstTime() {
    let data = JSON.parse(localStorage.getItem('firstTimeData'));
    if (data) {
      if (data.shop == false) {
        setTimeout(() => {
          this.bookus = true;
        }, 2000);
      } else {
        this.bookus = false;
      }
    }
    
  }
  gotIt(e) {
    this.bookus = false;
    let data = JSON.parse(localStorage.getItem('firstTimeData'));
    data.shop = true;
    localStorage.setItem("firstTimeData", JSON.stringify(data));
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  toggleContent(cont) {
    this.isContentToggled = !this.isContentToggled;
    this.displayText(cont);
    // cont = this.isContentToggled ? cont : this.displayText(cont);
  }

  readMoreReply(value) {
    return `${value}`;
  }

  displayText(textBody) {
    if(textBody.length > 50) {
      this.isReadMore = true;
    } else {
      this.isReadMore = false;
    }
    if(this.isContentToggled) {
      return `${textBody}`;
    } else {
      if(this.isReadMore === true ) {
    return `${textBody.substr(0, 50)}...`;
      } else {
        return `${textBody}`;
      }
    }
  }
  truncateString(text, e?) {
    if (e == 'therapist') {
      return _.truncate(text, {  'length': 90,  'separator': /,? +/});
    }
    if (e == 'service') {
      return _.truncate(text, {  'length': 40,  'separator': /,? +/});
    }
  }
  activeSlides: SlidesOutputData;
  getPassedData(data: SlidesOutputData) {
    this.activeSlides = data;
    this.currectSlide = data.slides[0].id
    console.log(this.activeSlides);
  }
  viewAllProducts() {
    this.router.navigate(['product/all', this.ownerId, this.locationId]);
  }
  chatOpened: boolean = false;
  openChat() {
    this.chatOpened = true;
  }
  chatOutput(e) {
    console.log(e);
    if(e === 'close') {
      this.chatOpened = false;
    }
  }
  navigateToVerification() {
    this.router.navigate(['auth/verify-email'], { state: { previous_url: `shop/${this.locationId}` } });
  }
}
