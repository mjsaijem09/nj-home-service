import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { BookingService } from 'src/app/services/booking.service';
import { DesktopModalComponent } from '../desktop-modal/desktop-modal.component';
import { PickTherapistService } from './picktherapist.service';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-pick-therapist',
  templateUrl: './pick-therapist.component.html',
  styleUrls: ['./pick-therapist.component.scss'],
})
export class PickTherapistComponent implements OnInit {
  locationId: any;
  ownerId: any;
  serviceId: any;
  serviceTime : any;
  isLoading: boolean = false;
  categoryId: any;
  shopName: any;
  serviceName: any;
  servicePrice: any;
  loyaltyPointCanRedeem: any;
  loyaltyPointRecieve: any;
  loyalityPoint: any;
  servicePricingName: any;
  ScreenWidth: any;
  ScreenHeight: any;
  ShowMobile: any;
  showMore: boolean = false;
  copyPickTherapistList: any;
  isMobile: boolean = false;  

  therapists: any = [];
  bookAnyone: boolean;
  selectedTherapistIndex: any;
  bookingData: any;
  @Input() shopDetail?: any;
  @Input() selectedService?: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pickTherapistService: PickTherapistService,
    private bookingService: BookingService,
    private authService: AuthServiceService,
    private ngbModal : NgbModal
  ) {
    this.getScreenSize();
  }

  getScreenSize() {
    this.ScreenWidth = window.innerWidth
    this.ScreenHeight = window.innerHeight
    if (this.ScreenWidth > 1024) {
      this.ShowMobile = false
    } else if (this.ScreenWidth < 1024) {
      this.ShowMobile = true
    }
  }

  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();
    this.activatedRoute.params.subscribe(params => {
      this.locationId = params['locationId'];
      this.ownerId = params['ownerId'];
      this.bookingService.startSlotBookingTime({
        data : null
      });
    });
    this.initializeBookingData()
  }
  initializeBookingData() {
    this.bookingData = this.bookingService.bookingData;
    if(!this.bookingData || this.bookingData== '' || !this.bookingData.shop || !this.bookingData.shop.ownerId || !this.bookingData.shop.locationId) {
      this.router.navigate(['/']);
    }
    this.ownerId = this.bookingData?.shop?.ownerId;
    this.locationId = this.bookingData?.shop?.locationId;
    this.serviceId = this.bookingData?.service?.serviceId;
    this.loadTherapist()
  }
 
  imgLink(e) {
    if(e) {
      let linkArr = e.split("/");
      return `${environment.image_url}/uploads/${linkArr[linkArr.length - 1]}`;
    }
  }
  currentFormattedDate() {
    var date = new Date();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + (date.getDate()+1)).slice(-2);
    var year = date.getFullYear();
    const formattedDate = year + '-' + month + '-' + day;
    return formattedDate;
  }

  // getAvailableTherapists() {
  //   this.isLoading = true;
  //   const date = this.currentFormattedDate();
  //   this.pickTherapistService.getAvailableTherapists(this.locationId, this.ownerId, date).subscribe((res: any) => {
  //     this.therapists = res.result;
  //     this.isLoading = false;
  //   }, err => { 
  //     console.log(err);
  //     this.isLoading = false; 
  //   });
  // }
  availableStaff=[];
  loadTherapist() {
    this.isLoading = true;
    this.pickTherapistService.therapists(this.locationId, this.ownerId, this.serviceId).subscribe((res: any) => {
      console.log(res.result);
      this.therapists = res.result;
      this.therapists.forEach(element => {
        if(element.availableToday) {
          this.availableStaff.push(element);
        }
      });
      this.isLoading = false;
    }, err => { 
      console.log(err);
      this.isLoading = false; 
    });
  }

  bookTherapist(item: any) {
    let bookingDetail = {
      shopName:this.shopName,
      serviceName:this.serviceName,
      serviceTime : this.serviceTime,
      servicePrice: this.servicePrice,
      therapistName:item.firstName,
      locationId : this.locationId,
      ownerId : this.ownerId,
      serviceId : this.serviceId,
      therapistId : item && item._id ? item._id : '123',
      categoryId: this.categoryId,
      loyaltyPointRecieve:this.loyaltyPointRecieve,
      loyaltyPointCanRedeem:this.loyaltyPointCanRedeem,
      loyalityPoint:this.loyalityPoint,
      servicePricingName:this.servicePricingName
    };

    if (!this.authService.getToken()) {
      this.bookingData.pathUrl = '/pick-therapist';
      this.router.navigate(['auth/login']);
      return false;
    }
    if(this.ShowMobile){
      this.router.navigate(['/select-time'], { queryParams: bookingDetail })
    }if(!this.ShowMobile){
     const modal = this.ngbModal.open(DesktopModalComponent,{
        size: 'xl',
        centered : true
      })

      modal.componentInstance.user = bookingDetail;

    }
    // localStorage.setItem('selectedTherapist', JSON.stringify({therapist : '', _id : ''}));
  }

  setTherapistListPagination(){
    // if (this.pickTherapistList.length > 0 && this.shopDetail) {
    //   if (!this.showMore) {
    //     this.pickTherapistList = this.pickTherapistList.slice(0, 3);
    //   } else {
    //     this.pickTherapistList = this.copyPickTherapistList;
    //   }
    // }
  }

  showMoreList(){
    this.showMore = !this.showMore;
    this.setTherapistListPagination();
  }

  navigateToTherapistDetail(therapist: any) {
    this.bookingData.therapist = {
      _id: therapist._id,
      firstName: therapist.firstName,
      lastName: therapist.lastName,
      image: therapist?.image,
      gender: therapist?.gender
    }
    this.router.navigate(['/therapist-detail', therapist?._id]);
  }

  bookanyone() {
    this.bookingData.bookAnyone = true;
    this.selectedTherapistIndex = null;
    this.bookingData.therapist = {requested_staff: false}
    setTimeout(() => {
      this.router.navigate(['/select-time'])
    }, 500)
  }

  setDefaultTherapistPic(e: any, gender: string) {
    if(gender === 'Male') {
      e.target.src = './assets/images/male-therapist.svg';
    } else {
      e.target.src = './assets/images/female-therapist.svg';
    }
  }

  checkAvailableDay(waitingTime: any) {
    const today = moment(new Date());
    const availableDay = moment(today).add(waitingTime, 'minutes');
    return today.diff(moment(availableDay).format('MM/DD/YYYY'), 'days') === 0 ? 'Today' : today.diff(moment(availableDay).format('MM/DD/YYYY'), 'days') === -1 ? 'Tomorrow' : today.diff(moment(availableDay).format('MM/DD/YYYY'), 'years') != 0 ? moment(availableDay).format('MMMM Do YYYY') : moment(availableDay).format('MMMM Do');
  }

  selectTime(index: any, therapist:any){
    this.bookingData.bookAnyone = false;
    this.selectedTherapistIndex = index;
    console.log(therapist);
    this.bookingData.therapist = {
      _id: therapist._id,
      firstName:therapist.firstName,
      lastName:therapist.lastName,
      image: therapist?.image,
      gender: therapist?.gender,
      requested_staff: true
    }
  }
}
