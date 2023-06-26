import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BookingService } from 'src/app/services/booking.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';

@Component({
  selector: 'app-online-payment',
  templateUrl: './online-payment.component.html',
  styleUrls: ['./online-payment.component.scss']
})
export class OnlinePaymentComponent implements OnInit {
  isLoading: boolean = true;
  data: any;
  payload: any;
  serviceTime: any;
  serviceDuration: any;
  bookingData: any;
  loginData
  URL
  constructor(
    private _router : Router,
    private _activeR: ActivatedRoute,
    private _http: ApiServicesService,
    private bookingService: BookingService,
    private toastr: ToasterService
  ) { }

  ngOnInit(): void {
    this.bookingData = this.bookingService.bookingData;
    this.loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
    this.URL = this._router.url;
    
    this._activeR.queryParams.subscribe(res=>{
      this.appointment(res.appointmentId)
    })
  }
  appointment(id) {
    this._http.get(`get_appointment/${id}`)
    .subscribe(res => {
      this.data = res.result[0];
      console.log(this.data)
      let startTime = this.data.startTime;
      let endTime = moment(this.data.endTime);
      let diff = moment.duration(endTime.diff(startTime));
      let hours = diff['_data'].hours;
      let minutes = diff['_data'].minutes;
      this.serviceDuration = diff.asMinutes();
      if (hours >= 1) {
        this.serviceTime = hours+'h'
        if (minutes >=1) {
          this.serviceTime = hours+'h' + " " + minutes+'min'
        }
      }else {
        this.serviceTime = minutes+'min'
      }
      console.log("diffHours", this.serviceTime)
      if(!this.loginData || !this.loginData.result) {
        this.toastr.error(`You need to login before you can pay your appointment online`);
        this.bookingData.pathUrl = this.URL;
        console.log("this.bookingData.pathUrl", this.bookingData.pathUrl);
        this._router.navigate(['auth/login']);
      } else {
        this.setBookingData();
      }
    })
  }
  setBookingData() {
    this.bookingData.appointmentId = this.data._id;
    this.bookingData.bookFor = this.data.bookedBy;
    this.bookingData.bookFor.clientId = this.data.bookedBy.id;
    this.bookingData.service = this.data.service;
    this.bookingData.service.serviceName = this.data.service.name;
    this.bookingData.service.servicePricingName = this.data.service_pricing_name;
    this.bookingData.service.serviceSpecialPrice = this.data.special_price;
    this.bookingData.service.duration = this.data.duration;
    this.bookingData.service.serviceId = this.data.service.id;
    this.bookingData.service.serviceDuration = this.serviceDuration;
    this.bookingData.service.serviceTime = this.serviceTime;
    this.bookingData.service.servicePrice = this.data.price;
    this.bookingData.therapist = this.data.staff;
    this.bookingData.therapist._id = this.data.staff.id;
    this.bookingData.therapist.requested_staff = this.data.requested_staff;
    this.bookingData.startTime = this.data.startTime;
    this.bookingData.endTime = this.data.endTime;
    this.bookingData.client = this.data.client;
    this.bookingData.shop = this.data.location;
    this.bookingData.shop.locationId = this.data.location._id;
    this.bookingData.shop.ownerId = this.data.ownerId;
    this.bookingData.shop.notes = this.data.notes;
    this.bookingData.payOnlineLink = true;
    console.log(this.bookingData);
    this._router.navigate(['/checkout']);
  }
  // http://localhost:4200/pay_online?appointmentId=6185545a35f5100012626756
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}

