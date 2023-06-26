import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { GiftcardService } from '../../giftcard.service';

@Component({
  selector: 'app-delivery-date-picker',
  templateUrl: './delivery-date-picker.component.html',
  styleUrls: ['./delivery-date-picker.component.scss']
})
export class DeliveryDatePickerComponent implements OnInit {
  subscription: Subscription;
  isMobile: boolean = false;
  giftcardDetails: any;
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
  }

  selectDate(d){
    this.model = d;
    console.log(this.model);
  }
  selectTime(t) {
    this.time = t;
    console.log(this.time);
  }
  next() {
    this.giftcardDetails.deliverDate = {
      date: `${this.model.year}-${this.model.month}-${this.model.day}`,
      time: `${this.time.hour}:${this.time.minute}`,
    }
    this.route.navigate(['giftcard/purchase-giftcard']);
  }
}
