import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BookingService } from 'src/app/services/booking.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-reschedule',
  templateUrl: './reschedule.component.html',
  styleUrls: ['./reschedule.component.scss']
})
export class RescheduleComponent implements OnInit {
  isLoading: boolean = true;
  data;
  payload;
  serviceTime;
  serviceDuration;
  startTime;
  endTime;
  startAt;
  endAt;
  address;
  bookingData;
  actionType;
  loginData;
  URL;
  constructor(
    private _router : Router,
    private _activeR: ActivatedRoute,
    private _http: ApiServicesService,
    private bookingService: BookingService,
    private toastr: ToasterService

  ) { }

  ngOnInit(): void {
    this.loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
    this.URL = this._router.url;
    // this.actionType = this.URL.split('?')[0].replace(/[^a-zA-Z ]/g, "");
    let route = this.URL.split('?')[0];
    let route_arr = route.split('/');
    this.actionType = route_arr.slice(-1).pop();
    this._activeR.queryParams.subscribe(res=>{
      this.appointment(res.appointmentId)
    })
  }
  appointment(id) {
    this._http.get(`get_appointment/${id}`)
    .subscribe(res => {
      this.data = res.result[0];
      console.log(this.data)
      this.startTime = moment(this.data?.startTime).format('ddd Do MMM YYYY');
      this.startAt = moment(this.data?.startTime).format("hh:mm a").replace(/\s+/g, '');
      this.endAt = moment(this.data?.endTime).format("hh:mm a").replace(/\s+/g, '');
      this.address = `${this.data?.location?.building}, ${this.data?.location?.street}, ${this.data?.location?.city}, ${this.data?.location?.state}, ${this.data?.location?.zip}`
      let startTime = this.data?.startTime;
      let endTime = moment(this.data?.endTime);
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
      this.initializeBookingSessionData()
      this.getShopDetails(this.data.location._id)
    })
  }
  shopData;
  imgLink(e) {
    if(e === undefined || e === null) {
      return './assets/images/no_image.png';
    } else {
      let splitLink = e.split("/");
      return `${environment.image_url}/uploads/${splitLink[splitLink.length - 1]}`;
    }
  }
  getShopDetails(id){
    this._http.get(`get_shop_detail?locationId=${id}&detail=true`)
    .subscribe(res => {
      if(res.status == 200) {
        this.shopData = res.result
        console.log(res)
      }
    })
  }
  initializeBookingSessionData() {
    this.payload = this.bookingService.bookingData;
    if(!this.loginData || !this.loginData.result) {
      this.toastr.error(`You need to login before you can ${this.actionType} your appointment`);
      this.payload.pathUrl = this.URL;
      console.log("this.payload.pathUrl", this.payload.pathUrl);
      this._router.navigate(['auth/login']);
    }
  }
  proceed() {
    console.log(this.data)
    if(this.data && this.data?.location && this.data?.ownerId) {
      const bookingDetails: any = {
        editAppointment: {
          appointmentId: this.data?._id,
          specialPrice: this.data?.special_price,
          price: this.data?.price
        },
        shop: {
          locationId: this.data.location._id,
          ownerId: this.data?.ownerId,
          name: this.data.location.name,
          loyaltyPoints: this.shopData?.loyalty_points,
          rating: this.shopData?.locationRating,
          selectTherapist: this.shopData?.onlineBookingRules?.selectTherapist,
          address: {
            bldg: this.shopData?.companyBuilding,
            street: this.shopData?.companyStreet,
            city: this.shopData?.companyCity,
            state: this.shopData?.companyState,
            zip: this.shopData?.companyZip,
          },
          image: this.shopData?.profileImage,
        }
      }
      if(this.actionType === 'edit') {
        this.bookingService.bookingData = bookingDetails;
        this._router.navigate(['/service']);
      }
      if(this.actionType === 'reschedule' || this.actionType === 'rebook') {
        bookingDetails.service = {
          loyaltyPointCanRedeem: this.data.service.loyaltyPointCanRedeem,
          loyaltyPointRecieve: this.data.service.loyaltyPointRecieve,
          serviceDuration: this.serviceDuration,
          serviceId: this.data.service.id,
          serviceName: this.data.service.name,
          servicePrice: this.data.price,
          servicePricingName: this.data.service_pricing_name,
          serviceSpecialPrice: this.data.special_price,
          serviceTime: this.serviceTime,
        };
        bookingDetails.therapist = {
          firstName: this.data.staff.firstName,
          gender: this.data.staff.gender,
          image: this.data.staff.image,
          lastName: this.data.staff.lastName,
          requested_staff: this.data.requested_staff,
          _id: this.data.staff.id,
        };
        bookingDetails.bookFor = {
          clientId: this.data.client._id,
          firstName: this.data.client.firstName,
          lastName: this.data.client.lastName,
        };
        bookingDetails.actionType = 'selectDate';
        this.bookingService.bookingData = bookingDetails;
        this._router.navigate(['/select-time']);
      }
    }
  }
  // http://localhost:4200/reschedule?appointmentId=618906925330b5001347c5e5
  navigateToHome() {
    this._router.navigate(['/']);
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}
