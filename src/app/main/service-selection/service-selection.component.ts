import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { BookingService } from 'src/app/services/booking.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-service-selection',
  templateUrl: './service-selection.component.html',
  styleUrls: ['./service-selection.component.scss'],
})
export class ServiceSelectionComponent implements OnInit {
  currentSection = '';
  activeVariable: any = 'massage';
  locationId: any;
  ownerId: any;
  serviceGroupList: any = [];
  copyServiceGroupList: any = [];
  serviceNameList: any = [];
  // @ViewChild('listItem') listItems!: QueryList<ElementRef>;
  shopName: any;
  categoryId: any;
  serviceName:any;
  loyalityPoint: any;
  isMobile: any;

  @Input() shopDetail?: any;
  @Output() selectedService: any = new EventEmitter<object>();
  showMore: boolean = false;

  constructor(
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private service: ApiServicesService,
    private _el: ElementRef,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.loyalityPoint = params['loyalityPoint'];
      this.locationId = params['locationId'];
      this.ownerId = params['ownerId'];
      this.shopName = params['shopName'];
      this.categoryId = params['categoryId']
      console.log(this.shopName);
    });
    this.getAllService();
    this.setServiceListPagination();
  }

  ngAfterViewInit() : void {
    // console.log(this.listItems);
  }

  activeButton(id:any){
    this.activeVariable = id
    console.log(this.activeVariable)
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  onSectionChange(sectionId: any) {
    this.currentSection = sectionId;
    setTimeout(() => {
      document.querySelector('.active')!.scrollIntoView({
        behavior: 'smooth'
      });
    }, 1000);
  }

  scrollTo(section:any) {
    let time = 200;
    if (this.shopDetail && !this.showMore) {
      this.showMore = false;
      this.showMoreList();
      time = 1000;
    }
    setTimeout(() => {
      section = section.replace(' ','_');
      document.querySelector('#' + section)!.scrollIntoView({
        behavior: 'smooth'
      });
    }, time);

    setTimeout(() => {
      this.currentSection = section;
    }, time+1000);
  }

  getAllService() {
    this.service
      .get(
        `get_services?shop_owner=${this.ownerId}&locationId=${this.locationId}`
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.serviceGroupList = res.result;
          this.serviceNameList = res.group_name.map((element: any) => {
            return { name: element };
          });

          let groupList = '';
          this.serviceGroupList = this.serviceGroupList.map((element: any) => {
            if (element.name != groupList) {
              element.serviceName = element.name;
              groupList = element.name;
              return element;
            }else{
              element.serviceName = null;
              return element;
            }
          });
          this.copyServiceGroupList = _.cloneDeep(this.serviceGroupList);
          this.setServiceListPagination();
          console.log(this.serviceNameList);
        }
      });
  }

  // routing
  goToPickTherapist(item:any) {
    localStorage.setItem('serviceSelected', JSON.stringify(item));
    if (!this.shopDetail) {
      this.router.navigate(['/pick-therapist'],{queryParams:
        {locationId: this.locationId,
          ownerId : this.ownerId,
          serviceId : item.services._id,
          serviceTime : item.services.pricing_option.duration,
          shopName:this.shopName,
          serviceName:item.services.name,
          servicePrice:item.services.pricing_option.price,
          servicePricingName:item.services.pricing_option.specialPriceFor,
          loyaltyPointCanRedeem:item.services.pricing_option.loyaltyPointCanRedeem,
          loyaltyPointRecieve:item.services.pricing_option.loyaltyPointRecieve,
          loyalityPoint:this.loyalityPoint

          }});
    } else {
      this.selectedService.emit(item);
    }
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
}
