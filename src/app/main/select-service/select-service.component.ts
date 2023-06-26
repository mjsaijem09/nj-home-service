import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { MultiServiceOptions, ServiceOptions, TabLinks } from '../../shared/constants/select-service/service-options.constant';
import * as _ from "lodash";
import { BookingService } from 'src/app/services/booking.service';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-select-service',
  templateUrl: './select-service.component.html',
  styleUrls: ['./select-service.component.scss']
})
export class SelectServiceComponent implements OnInit {
  isMobile: boolean = false;
  currTab = 'massage'
  locationId: any;
  ownerId: any;
  categoryId: any;
  therapistId: any;
  loyaltyPoints: number = 0;
  bookingDetails: any;
  staticServiceOptions = ServiceOptions;
  staticMultiServiceOptions = MultiServiceOptions;
  tabLinks = TabLinks;

  currentSection = '';
  activeVariable: any = 'massage';
  serviceGroupList: any = [];
  copyServiceGroupList: any = [];
  serviceNameList: any = [];
  // @ViewChild('listItem') listItems!: QueryList<ElementRef>;
  shopName: any;
  selectedService: any;
  selectedItem: any;
  serviceName:any;
  shopDetail?: any;
  // @Input() shopDetail?: any;
  // @Output() selectedService: any = new EventEmitter<object>();
  showMore: boolean = false;
  isLoading: boolean = false;
  selectedServiceIndex:any;
  businessLocation: any;

  customOptions: OwlOptions = {
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
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 2
      },
      940: {
        items: 2
      }
    },
  }
  activeCategory: any;
  bookingData: any;
  currency = {name: 'USD', symbol: '$'};
  constructor(private router:Router,
    private newToast: ToasterService,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    private service: ApiServicesService,
    private _el: ElementRef) { }

  ngOnInit(): void {
    if (window.innerWidth > 1024) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
    this.bookingService.startSlotBookingTime({
      data: null
    });
    this.businessLocation = localStorage.getItem('businessLocation') && JSON.parse(localStorage.getItem('businessLocation'));
    this.initializeBookingData()
    this.setServiceListPagination();
  }
  initializeBookingData() {
    this.bookingData = this.bookingService.bookingData;
    console.log(this.bookingData);
    let URL;
    this.isLoading = true;
    if(!this.bookingData || this.bookingData == '' || !this.bookingData.shop || !this.bookingData.shop.ownerId || !this.bookingData.shop.locationId) {
      this.router.navigate(['/']);
    }
    if (this.bookingData.shop.currency) {
      this.currency = this.bookingData.shop.currency;
    }
    this.ownerId = this.bookingData?.shop?.ownerId;
    this.locationId = this.bookingData?.shop?.locationId;
    if (this.bookingData.shop && this.bookingData.shop.loyaltyPoints) {
      let loyaltyPts = this.bookingData.shop.loyaltyPoints;
      if(typeof loyaltyPts !== 'object' && loyaltyPts !== null) {
        this.loyaltyPoints = this.bookingData.shop.loyaltyPoints;
      }
    }
    if(this.bookingData.therapist && this.bookingData.therapist._id) {
      this.therapistId = this.bookingData.therapist._id;
    }
    if(this.ownerId && this.locationId) {
      if(this.therapistId) {
        URL = `get_services?shop_owner=${this.ownerId}&locationId=${this.locationId}&therapistId=${this.therapistId}&pwa=true`
      } else {
        URL = `get_services?shop_owner=${this.ownerId}&locationId=${this.locationId}&pwa=true`
      }
      this.service.get(URL).subscribe((res: any) => {
        if (res.status == 200) {
          
          this.serviceNameList = res.group_name.map((element: any) => {
            return { name: element };
          });

          let groupList = _.cloneDeep(this.serviceNameList);
          _.each(groupList, (group)=>{
          group.description = _.find(res.result, (o)=>{return group.name == o.name}).description || '';
            const serviceList = _.filter(res.result, (o)=>{return group.name == o.name && o.services.onlineBooking});
            group.totalService = _.sortedUniq(_.map(serviceList, (o)=>{return o.services.name}));
            group.services = [];
            _.each(group.totalService, (service) => {
              const subServices = _.filter(serviceList, (o)=>{return o.services.name == service});
              group.services.push({name: service, subServices: subServices})
            })
          });
          this.serviceGroupList = groupList;
          this.activeCategory = groupList[0]?.name;
          this.copyServiceGroupList = _.cloneDeep(res.result);
          this.setServiceListPagination();
          this.isLoading = false;
        }
      }, err => {
        this.isLoading = false;
      });
    }
  }

  activeButton(id:any){
    this.activeVariable = id
  }

  setActiveBlock(itm:any){
    if(this.selectedServiceIndex == itm.subServices[0]?.services?._id){
      this.selectedServiceIndex = ""
    }else{
      this.selectedServiceIndex = itm.subServices[0]?.services?._id;
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  onSectionChange(sectionId: any) {
    // this.currentSection = sectionId;
    // setTimeout(() => {
    //   document.querySelector('.active')!.scrollIntoView({
    //     behavior: 'smooth'
    //   });
    // }, 1000);
  }
  removeSpace(e) {
    let className = e.replace(/ /g, '-');
    return className;
  }
  scrollTo(section:any) {
    let className = section.replace(/ /g, '-');

    this.activeCategory = section;
    let time = 200;
    if (this.shopDetail && !this.showMore) {
      this.showMore = false;
      this.showMoreList();
      time = 1000;
    }
    // section = section.split(' ').join('_');
    setTimeout(() => {
      
      document.querySelector('#' + className)!.scrollIntoView({
        behavior: 'smooth'
      });
    }, time);

   
    this.currentSection = className;
    
  }

  // Service Selection:
  selectService(item: any, pricing_option:any) {
    const replaceHour = pricing_option.duration.replace(/1h\b/g, "60"); // Replace 1h -> 60
    const replaceMin = replaceHour.replace(/min\b/g, ""); // Replace remove min
    const replaceSpace = replaceMin.split(/[ ,]+/).map(s => Number(s)); //Split string with , and convert to number
    const getDuration = replaceSpace.reduce((a, b) => a + b); // Add up all numbers
    const duration = getDuration;
    this.selectedService = {
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
    this.bookingData.service = this.selectedService;
    console.log(this.bookingData)
  }

  goToNext() {
    if (this.bookingData.shop.selectTherapist) {
      if(this.selectedService) {
        if(!this.therapistId) {
          this.router.navigate(['/pick-therapist', this.locationId, this.ownerId]);
        } else if(!this.bookingDetails?.startTime) {
          this.router.navigate(['/select-time']);
        } else {
          this.router.navigate(['/select-time']);
        }
      } else {
        this.newToast.error("Please select service");
      }
    } else {
      this.router.navigate(['/select-time']);
    }
  }

  goToNextDesktop() {
    this.router.navigate(['/select-time']);
  }

  bookSlotTime() {
    this.isLoading = true;
    // let params = new HttpParams();//
    let obj: any = {};

    obj['staff_id'] = this.therapistId;
    obj['location_id'] = this.locationId;
    obj['service_time'] = this.minuteCalculate(this.selectedService.serviceTime);
    obj['ownerId'] = this.ownerId;
    obj['service_id'] = this.selectedService.serviceId;
    obj['service_name'] = this.selectedService.serviceName;
    obj['bookedFrom'] = 'PWA';
    obj['startTime'] = this.bookingDetails.startTime;
    obj['price'] = this.selectedService.serviceSpecialPrice || this.selectedService.servicePrice;


    this.service.post('slots', obj).subscribe((res) => {
      this.isLoading = false;
      // this.slotData = res.result;
       this.router.navigate(['/book-for']);
    }, (err: any) => {
      this.isLoading = false;
      this.newToast.error(err.body);
    });
  }

  minuteCalculate(i: any) {
    // var service = this.appointmentForm["controls"]["booking"]["controls"][i]["controls"]["service"].value;
    var duration = i.split(' ');
    let min = 0;
    if (duration.length == 2 && duration[1] == 'min') {
      min = Number(duration[0]);
      this.bookingDetails.service.duration = {
        hour: 0,
        min
      }
    }
    if (duration.length == 2 && duration[1] != 'min') {
      let hour = duration[0].replace('h', '');
      let hourMin = Number(hour) * 60;
      let min = duration[1].replace('min', '');
      min = Number(hourMin) + Number(min);
      this.bookingDetails.service.duration = {
        hour,
        min
      }
    }
    if (duration.length === 1) {
      let hour = duration[0].replace('h', '');
      let hourMin = Number(hour) * 60;
      min = Number(hourMin);
      this.bookingDetails.service.duration = {
        hour,
        min: 0
      }
    }
    this.bookingService.setBookingDetails(this.bookingDetails);
    return min;
  }

  setServiceListPagination(){
    if (this.serviceGroupList.length > 0 && this.shopDetail) {
      if (!this.showMore) {
        this.serviceGroupList = this.serviceGroupList.slice(0, 3);
      } else {
        this.serviceGroupList = this.copyServiceGroupList;
      }
    }
  }

  showMoreList(){
    this.showMore = !this.showMore;
    this.setServiceListPagination();
  }

  showContent(type: any) {
    this.currTab = type
    if (this.currTab == 'massage') {
      // this.isContentType = true 
    }
    if (this.currTab == 'facial') {
      // this.isContentType = true 
    }
    if (this.currTab == 'eqiupment') {
      // this.isContentType = true 
    }
    else
      setTimeout(() => {
        // this.isContentType = false;
      });
    // this.favioritetherapist()
    // this.isContentType = true; 
  }

  priceOption(e, i) {
    let first = e.at(0);
    let last = e.at(-1);
    switch (i) {
      case 'duration':
        if (e.length >= 2) {
          return `${first.duration} - ${last.duration}`;
        } else {
          return `${first.duration}`;
        }
      case 'price':
        if (first.specialPrice != null) {
          return `${this.currency.symbol}${first.specialPrice}`;
        } else {
          return `${this.currency.symbol}${first.price}`;
        }
    }
  }

}
