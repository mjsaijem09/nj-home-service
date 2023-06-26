import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';
import {Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { GiftcardService } from '../giftcard.service';
@Component({
  selector: 'app-delivery-date',
  templateUrl: './delivery-date.component.html',
  styleUrls: ['./delivery-date.component.scss']
})
export class DeliveryDateComponent implements OnInit {
  subscription: Subscription;
  option = 'send_now';
  refresh = true;
  // calendar vars
  model: NgbDateStruct;
  getSelectedDate: any;
  minDate: any;
  //calendar settings
  displayMonths = 1;
  navigation = 'arrows';
  showWeekNumbers = false;
  outsideDays = 'hidden';

  // Time vars
  time: { hour: number, minute: number};
  meridian = true;
  TimeSuffix = true;

  selectedDate: any;
  timeZone: any;

  giftcardDetails: any;

  isMobile: boolean = false;

  constructor(
    private route:Router,
    private gc: GiftcardService,
  ) { }

  ngOnInit(): void {
    this.isMobile = this.gc.isMobileView();
    this.loadcalendar()
    this.subscription = this.gc.getGiftcardDetails()
    .subscribe((details: any) => {
      this.giftcardDetails = details;
    });
    console.log(this.giftcardDetails)
    if(!this.giftcardDetails.shopDetails.ownerid) {
      this.route.navigate(['/']);
    }
    this.getCurrentTime();
  }
  getCurrentTime() {
    this.time = {hour: new Date().getHours(), minute: new Date().getMinutes()};
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  
  loadcalendar() {
    const current = new Date();
    this.minDate = {year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate()};
    this.model = {year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate()};
    this.refresh = false;
    setTimeout(() => { this.refresh = true }, 1);
  }

  selectDate(d){
    this.model = d;
    console.log(this.model);
  }
  selectTime(t) {
    this.time = t;
    console.log(this.time);
  }
  
  sendOption(e) {
    this.option = e;
    this.loadcalendar()
  }
  
  next() {
    if (this.option == 'send_now') {
      this.giftcardDetails.deliverDate = {
        date: 'Send Directly',
        time: ''
      }
      this.route.navigate(['giftcard/purchase-giftcard']);
    } else {
      // this.giftcardDetails.deliverDate = {
      //   date: `${this.model.year}-${this.model.month}-${this.model.day}`,
      //   time: `${this.time.hour}:${this.time.minute}`,
      // }
      this.route.navigate(['giftcard/delivery-date-picker']);
    }
  }
}
