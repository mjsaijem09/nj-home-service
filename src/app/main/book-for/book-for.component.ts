import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiServicesService } from 'src/app/services/api-services.service';
import {BookforService} from './bookfor.service'
import { TimeSlotSelectedComponent } from 'src/app/shared-components/time-slot-selected/time-slot-selected.component';
import * as moment from 'moment';
import { BookingService } from 'src/app/services/booking.service';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ContactModalComponent } from '../contact/contact-modal/contact-modal.component';
@Component({
  selector: 'app-book-for',
  templateUrl: './book-for.component.html',
  styleUrls: ['./book-for.component.scss']
})
export class BookForComponent implements OnInit {

  bookList:any=[];
  loginData: any;
  isLoading: boolean = false;
  shopName: any;
  serviceName: any;
  serviceTime: any;
  servicePrice: any;
  therapistName: any;
  timeSlot: any;
  serviceId: any;
  therapistId: any;
  locationId: any;
  loyaltyPointCanRedeem: any;
  loyaltyPointRecieve: any;
  ownerId: any;
  loyalityPoint: any;
  servicePricingName: any;
  durationHour: any;
  durationMin: any;
  startDate: any;
  endDate: any;
  @Input() selectTimeData : any;
  @Output() bookForContent : EventEmitter<any> = new EventEmitter(); 
  ScreenWidth: any;
  ScreenHeight: any;
  ShowMobile: any;

  isMobile: boolean = false;
  bookingData: any;

  constructor(private router: Router,
    private bookingService: BookingService,
    private NgbModal: NgbModal,
    private bookservice: BookforService,
    private active: ActivatedRoute,
    private service: ApiServicesService,
    private toastr: ToasterService
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
    this.loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
    this.getBookDetails()
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  goToAddRelation(){
    console.log("this.loginData", this.loginData);
    const modalRef = this.NgbModal.open(ContactModalComponent, {centered: true, windowClass : "_contact"});
    modalRef.componentInstance.newContact = {
      firstName : "",
      lastName: "",
      email: "",
      phone1: "",
      image: "",
      work: "",
      relationship : "",
      address : "",
      id : this.loginData?.client,
      header : 'Add New Contact'
    };
    modalRef.componentInstance.modalOption = modalRef;
    modalRef.result.then((res) => {
      console.log(res)
      if(res == 'Submit'){
        this.getBookDetails();
      }
      
    });
  }
  getBookDetails(){
    this.isLoading = true;
    this.bookingData = this.bookingService.bookingData;
    if(!this.loginData || !this.loginData.result) {
      this.toastr.error('Please login to complete this booking');
      this.bookingData.pathUrl = '/book-for';
      this.router.navigate(['auth/login']);
    }
    if(!this.bookingData || !this.bookingData.shop || !this.bookingData.shop.ownerId || !this.bookingData.shop.locationId) {
      this.router.navigate(['/']);
    }
    if(this.bookingData.shop && !this.bookingData.therapist) {
      this.router.navigate(['/pick-therapist', this.bookingData?.shop?.locationId, this.bookingData?.shop?.ownerId]);
    }
    if(!this.bookingData.startTime) {
      this.router.navigate(['/select-time']);
    }
    if(!this.bookingData.service) {
      this.router.navigate(['/service']);
    }
    this.bookservice.bookFor(this.loginData?.client).subscribe((res:any) => {
      this.bookList = res.ClientRelations;
      console.log(this.bookList);
      this.isLoading=false
    }, err => {
      this.isLoading = false;
      console.log(err);
      this.bookList = [];
    })
  }
  selectBookFor(client: any) {
    const { clientId, firstName, lastName } = client;
    this.bookingData.bookFor = { clientId, firstName, lastName };
    this.router.navigate(['/confirm-booking']);
  }
  setDefaultPic(e: any) {
    if(!this.loginData.result.gender) {
      e.target.src = './assets/images/carbon_user-avatar-filled.svg';
    } else if (this.loginData.result.gender === 'Male') {
      e.target.src = './assets/images/male-user.svg';
    } else {
      e.target.src = './assets/images/female-user.svg';
    }
  }
  setDefaultRelationUserPic(e: any, gender: any) {
    if(!gender) {
      e.target.src = './assets/images/carbon_user-avatar-filled.svg';
    } else if (gender === 'Male') {
      e.target.src = './assets/images/male-user.svg';
    } else {
      e.target.src = './assets/images/female-user.svg';
    }
  }
  bookForSelf() {
    const client = {
      clientId: this.loginData?.client,
      firstName: this.loginData?.result?.firstName,
      lastName: this.loginData?.result?.lastName
    }
    this.selectBookFor(client);
  }
  deleteItem(item: any): void {
    this.isLoading = true;
    this.bookservice.deleteBookForItem(item._id, this.loginData?.client).subscribe(_=> {
      this.bookList = [];
      this.getBookDetails();
      this.isLoading=false;
    }, err => {
      this.isLoading=false;
      console.log(err);
    });
  };
}
