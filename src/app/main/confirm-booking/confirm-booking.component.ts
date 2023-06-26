import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormArray, FormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgbCalendar,
  NgbDateParserFormatter,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';


import { ApiServicesService } from 'src/app/services/api-services.service';
import { BookingService } from 'src/app/services/booking.service';
@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.component.html',
  styleUrls: ['./confirm-booking.component.scss'],
})
export class ConfirmBookingComponent implements OnInit {
  @ViewChild('content') content: ElementRef<HTMLElement> | any;
  @Input() private sendRequestData : any;
  @Output() requestData : EventEmitter<any> = new EventEmitter();
  model: NgbDateStruct | undefined;
  today = this.calendar.getToday();
  orderForm: UntypedFormGroup | any;
  date: UntypedFormArray | any;
  storeDetails: any;
  clientdata: any;
  step1 = true;
  step2 = false;
  notes = '';
  isMobile: boolean = false;
  bookingData: any;
  currency: string;
  constructor(
    private router: Router,
    private calendar: NgbCalendar,
    private bookingService: BookingService,
    private httpService: ApiServicesService,
    public datepipe: DatePipe
  ) {} 

  ngOnInit(): void {
    this.getBookingDetails();
    this.isMobile = this.bookingService.isMobileView();
    const loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
    if (!loginData || !loginData.result) {
      this.bookingData.pathUrl = '/confirm-booking';
      this.router.navigate(['auth/login']);
    }
  }
  
  getBookingDetails() {
    this.bookingData = this.bookingService.bookingData;
    console.log(this.bookingData);
    if(!this.bookingData || !this.bookingData.shop) {
      this.router.navigate(['/']);
    } {
      this.currency = this.bookingData.shop.currency.symbol;
    }
    if(!this.bookingData.service) {
      this.router.navigate(['/service']);
    }
    if(!this.bookingData.therapist) {
      this.router.navigate(['/pick-therapist']);
    }
    if(!this.bookingData.startTime) {
      this.router.navigate(['/select-time']);
    }
    if(!this.bookingData.bookFor) {
      this.router.navigate(['/book-for']);
    }
  }
  gotoDateTime(){
    this.router.navigate(['/select-time']);
  }
  gotoBookFor(){
    this.router.navigate(['/book-for']);
  }
  goToConfirm(){
    this.bookingData.notes = this.notes;
    this.router.navigate(['/checkout']);
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  freeTime() {
    return this.bookingData.shop.editTime ? this.bookingData.shop.editTime : 1;
  }
}