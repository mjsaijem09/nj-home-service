import { HttpParams, HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbDate, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { BookingService } from 'src/app/services/booking.service';
import { TimeSlotSelectedComponent } from 'src/app/shared-components/time-slot-selected/time-slot-selected.component';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.scss'],
})
export class SelectTimeComponent implements OnInit {
  timeData!: any;
  @Input() private staff : any;
  @Input() public isChild: any;
  @Output() changeContent : EventEmitter<any> = new EventEmitter();
  queryParamsData: any = {};
  shopName: any;
  serviceName: any;
  therapistName: any;
  serviceTime: any;
  servicePrice: any;
  serviceDuration: any;
  timeSlot: any;
  serviceId: any;
  therapistId: any;
  locationId: any;
  loyaltyPointCanRedeem: any;
  loyaltyPointRecieve: any;
  ownerId: any;
  loyalityPoint: any;
  servicePricingName: any;
  slotData: any;
  startTime: any;
  endTime: any;
  durationHour: any;
  ScreenWidth: any;
  ScreenHeight: any;
  ShowMobile: any;
  newTime: any = [];
  days: any = [];
  CurrentDate: any;
  currectDays: any;
  outsideDays = 'hidden';
  navigation = 'arrows';
  showWeekNumbers = false;
  slotLoader = false;
  displayMonths = 1;

  // calendar vars
  model: NgbDateStruct | undefined;
  date: {year: number, month: number} | undefined;
  unavailableDates:any
  loadDisabledDates = false
  disabledDates: NgbDateStruct[] = [];

  isMobile: boolean = false;
  bookAnyone: boolean = false;
  bookingData: any;
  selectStaff: boolean = true;
  currency: string;
  constructor(
    private calendar: NgbCalendar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: ApiServicesService,
    private NgbModal: NgbModal,
    private bookingService: BookingService,
    private toastService: ToasterService,
    private http: HttpClient,
    private toastr: ToasterService
  ) {
    this.getScreenSize();
  }
  getScreenSize() {
    this.ScreenWidth = window.innerWidth;
    this.ScreenHeight = window.innerHeight;
    if (this.ScreenWidth > 1024) {
      this.ShowMobile = false;
    } else if (this.ScreenWidth < 1024) {
      this.ShowMobile = true;
    }
  }
  selectSpecific(e:any) {}
  ngOnInit(): void {
    this.model = this.calendar.getToday();
    this.bookingData = this.bookingService.bookingData;
    if(!this.bookingData || !this.bookingData.shop || !this.bookingData.shop.ownerId || !this.bookingData.shop.locationId) {
      this.router.navigate(['/']);
    }
    this.locationId = this.bookingData.shop.locationId
    this.ownerId = this.bookingData.shop.ownerId;
    this.shopName = this.bookingData.shop.name;
    this.loyalityPoint = this.bookingData.shop.loyalityPoint;
    this.therapistId = this.bookingData.therapist?._id;
    this.therapistName = this.bookingData.therapist?.firstName;
    this.serviceId = this.bookingData.service?.serviceId;
    this.serviceName = this.bookingData.service?.serviceName;
    this.serviceTime= this.bookingData.service?.serviceTime;
    this.servicePrice= this.bookingData.service?.servicePrice;
    this.serviceDuration= this.bookingData.service?.serviceDuration;
    this.selectStaff = this.bookingData.shop.selectTherapist;
    this.currency = this.bookingData.shop.currency.symbol;
    let now = new Date();
    let date = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    setTimeout(() => {
      this.selectedTime(date, true);
    });
    if(this.therapistId){
      // var date = this.appendZero(now.getMonth() + 1) + '-' + this.appendZero(now.getDate()) + '-' + now.getFullYear();
      let newDate = `${this.appendZero(date.month)}-${this.appendZero(date.day)}-${date.year}`;
      this.loadDates(newDate);
    } else{
      this.loadDisabledDates = true;
    }
    this.defaultDay();
    this.disablePastDates();
    this.isMobile = this.bookingService.isMobileView();
    this.loadTherapists();
    console.log("staff: ",this.staff);
  }
  denote() {
    let denote = "";
    switch (this.staff.gender) {
      case "Male":
        denote = "him";
        break;
      case "Female":
        denote = "her";
        break;
      default:
        denote = "";
        break;
    }
    return denote;
  }
  disablePastDates() {
    const current = new Date();
    this.currectDays = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }
  defaultDay() {
    const now = new Date();
    this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }
  loadDates(date) {
    if (this.therapistId) {
      this.http.get(`${environment.api_url}slot_not_avilable?staff_id=${this.therapistId}&location=${this.locationId}&date=${date}`)
      .subscribe(
        data => {
          const time = this.unavailableDates = data['results'];
          if(time.length != 0){
            let disabledDates = [];
            time.forEach(date => {
              const [year, month, day] = date.split(/[-,]+/).map((s:any) => Number(s));
              const getDates: NgbDateStruct = { year, month, day };
              disabledDates.push(getDates);
            });
            this.disabledDates = disabledDates;
            this.loadDisabledDates = true;
          }else {
            this.disabledDates = [];
            this.loadDisabledDates = true;
          }
        }
      )
    }
  }
  isDisabled = (date: NgbDateStruct)=> {
    return this.disabledDates.find(x => NgbDate.from(x)?.equals(date))? true: false;
  }
  navigateMonth(e) {
    let date = '';
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    if (e.month == month) {
      date = this.appendZero(e.month) + '-' + this.appendZero(day) + '-' + e.year;
    } else {
      date = this.appendZero(e.month) + '-' + '01' + '-' + e.year;
    }
    if (this.therapistId) {
      this.loadDates(date);
    }
  }
  appendZero(num: number) {
    return num < 10 ? `0${num}` : num;
  }
  dateSelected(e:any={}) {
    if (e != null) {
      this.refreshCalendar = true;
      let newDate : any;
      newDate = new Date();
      newDate = parseInt(newDate.getDate(), 10);
      if(newDate == e.day){
        this.selectedTime(e, true);
      }else{
        this.selectedTime(e, false);
      }
    } else {
      const now = new Date();
      let newDate = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate()
      };
      this.checkNextAvailableDate(newDate);
    }
    
  }
  slotStaffId = ''
  selectSpecificTime(e: any) {
    let elementId = 'staff-'+e.staffId;
    this.slotStaffId = e.staffId;
    setTimeout(() => {
      document.querySelector('#' + elementId)!.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }, 500);
    this.timeSlot = e.slot;
    if(!this.therapistId) {
      this.bookingData.therapist = {_id: e.staffId}
      this.service.get(`get_therapist/${e.staffId}`).subscribe(res => {
        const therapist = res.result;
        this.therapistId = therapist._id
        this.bookingData.therapist = {
          _id: therapist._id,
          firstName: therapist.firstName,
          lastName: therapist.lastName,
          image: therapist?.image,
          gender: therapist?.gender,
          requested_staff: false
        }
        this.bookingData.startTime = this.timeSlot;
      });
    } else {
      this.bookingData.startTime = this.timeSlot;
    }
  }
  displayPopup() {
    if(this.timeSlot) {
      this.NgbModal.open(TimeSlotSelectedComponent, {
        size: 'sm',
        centered: true,
        windowClass: 'min3-modal',
      }).result.then(
        (result) => {
        },
        (reason) => {
          if(this.serviceId){
            this.bookSlotTime();
          }else {
            this.router.navigate(['/service']);
          }
          
        }
      );
    } else {
      this.toastService.error('Please select slot');
    }
  }
  bookSlot() {
    if(this.timeSlot) {
      if(this.serviceId){
        this.bookSlotTime();
      } else {
        this.router.navigate(['/service']);
      }
    } else {
      this.toastService.error('Please select slot');
    }
  }
  requestSlot(){
    this.router.navigate(['/send-request']);
  }
  bookSlotTime() {
    let obj: any = {};
    obj['staff_id'] = this.therapistId;
    obj['location_id'] = this.locationId;
    obj['service_time'] = this.minuteCalculate(this.serviceTime);
    obj['ownerId'] = this.ownerId;
    obj['service_id'] = this.serviceId;
    obj['service_name'] = this.serviceName;
    obj['bookedFrom'] = 'BookUs Web App';
    obj['startTime'] = this.timeSlot;
    obj['price'] = this.servicePrice;
    this.service.post('slots', obj).subscribe((res) => {
    this.slotData = res.result;
    this.bookingService.startSlotBookingTime({
      data: {
        shopName: this.shopName,
        serviceName: this.serviceName,
        serviceTime: this.serviceTime,
        servicePrice: this.servicePrice,
        therapistName: this.therapistName,
        timeSlot: this.timeSlot,
        serviceId: this.serviceId,
        therapistId: this.therapistId,
        locationId: this.locationId,
        loyaltyPointRecieve: this.loyaltyPointRecieve,
        loyaltyPointCanRedeem: this.loyaltyPointCanRedeem,
      },
    });
    this.bookingData.endTime = this.slotData.endTime;
    this.bookingService.setBookingDetails(this.bookingData);
    if (this.bookingData.bookFor){
      this.router.navigate(['/confirm-booking']);
    } else {
    this.router.navigate(['/book-for']);
    }
    },
    (err: any) => {
      this.toastService.error(err.body);
    });
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  minuteCalculate(i: any) {
    var duration = i.split(' ');
    let min = 0;
    if (duration.length == 2 && duration[1] == 'min') {
      min = Number(duration[0]);
      this.bookingData.service.duration = {
        hour: 0,
        min
      }
    }
    if (duration.length == 2 && duration[1] != 'min') {
      let hour = duration[0].replace('h', '');
      let hourMin = Number(hour) * 60;
      let minute = duration[1].replace('min', '');
      min = Number(hourMin) + Number(minute);
      this.bookingData.service.duration = {
        hour,
        min
      }
    }
    if (duration.length === 1) {
      let hour = duration[0].replace('h', '');
      let hourMin = Number(hour) * 60;
      min = Number(hourMin);
      this.bookingData.service.duration = {
        hour,
        min: 0
      }
    }
    this.bookingService.setBookingDetails(this.bookingData);
    return min;
  }
  
  selectedTime(date: any, presentDate?: boolean) {
    let formatDate = `${date.year}-${this.appendZero(date.month)}-${this.appendZero(date.day)}`;
    let params = new HttpParams();
    if (this.therapistId){
    params = params.set('staff_id', this.therapistId);
    }
    params = params.set('location_id', this.locationId);
    params = params.set('service_id', this.serviceId);
    params = params.set('service_time', this.serviceDuration);
    params = params.set('ownerId', this.ownerId);
    params = params.set('date', formatDate);
    this.slotLoader = true;
    this.service.get('slots', params).subscribe((res) => {
      let newDataList: any = [];
      let endDataList: any = [];
      newDataList = res.result.filter((resp: any) => {
        let data: any = [];
        data = resp.slot.split('T');
        if(resp && resp.status === 'active') {
          if (data[0] == formatDate) {
            if(presentDate){
              if(moment(resp.slot).isAfter(moment())) {
                return resp
              }
            }if(!presentDate){
              return resp
            }
          }
        }
      });
      endDataList = res.endSlot.filter((resp: any) => {
        let data: any = [];
        data = resp.slot.split('T');
        if(resp && resp.status === 'active') {
          if (data[0] == formatDate) {
            if(presentDate){
              if(moment(resp.slot).isAfter(moment())) {
                return resp
              }
            }if(!presentDate){
              return resp
            }
          }
        }

      });
      this.slotLoader = false;
      this.timeData = newDataList;
      this.newTime = _.sortBy(endDataList, ['slot']);
      if (newDataList.length == 0 && this.therapistId) {
        this.checkNextAvailableDate(date);
      }
    }, (err) => {
      this.slotLoader = false;
      this.timeData = [];
      this.newTime = [];
    });
  }
  sendRequest() {
    this.router.navigate(['/send-request'], {
      queryParams: {
        locationId: this.bookingData.locationId,
        ownerId: this.bookingData.ownerId,
        serviceId: this.bookingData.serviceId,
        therapistId: this.bookingData.therapistId,
        categoryId: this.bookingData.categoryId,
        loyalityPoint: this.bookingData.loyalityPoint,
        loyaltyPointCanRedeem: this.bookingData.loyaltyPointCanRedeem,
        loyaltyPointRecieve: this.bookingData.loyaltyPointRecieve,
        serviceName: this.bookingData.serviceName,
        servicePrice: this.bookingData.servicePrice,
        servicePricingName: this.bookingData.servicePricingName,
        serviceTime: this.bookingData.serviceTime,
        shopName: this.bookingData.shopName,
        therapistName: this.bookingData.therapistName,
      },
    });
  }
  public rating(r) {
    return Math.round(r * 10) / 10
  }
  therapists: any;
  reload: boolean = true;
  bookanyone(){
    let now = new Date();
    let date = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.therapistId = undefined;
    this.therapistName = undefined;
    this.reload = false;
    this.timeSlot = ""
    this.timeData = [];
    this.newTime = [];
    this.disabledDates = [];
    this.defaultDay();
    let newDate = `${this.appendZero(date.month)}-${this.appendZero(date.day)}-${date.year}`;
    this.loadDates(newDate);
    this.bookAnyone = true;
    this.bookingData.therapist = {
      _id: undefined,
      firstName: undefined,
      lastName: undefined,
      image: undefined,
      gender: undefined,
      requested_staff: false
    }
    setTimeout(() => {
      this.reload = true;
      this.selectedTime(date, true);
    }, 0);
  }
  nextAvailableDate
  checkNextAvailableDate(date) {
    let newDate = `${date.year}-${date.month}-${date.day}`
    this.service.get(`next_avilable_date?staff_id=${this.therapistId}&location=${this.locationId}&date=${newDate}&ownerId=${this.ownerId}`).subscribe(
      res => {
        this.nextAvailableDate = res.results;
      }
    )
  }
  selectTherapist(e) {
    let now = new Date();
    let date = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.staff = e;
    this.bookAnyone = false;
    this.reload = false;
    this.therapistId = e._id;
    this.therapistName = e?.firstName;
    this.timeSlot = ""
    this.timeData = [];
    this.newTime = [];
    this.defaultDay();
    let newDate = `${this.appendZero(date.month)}-${this.appendZero(date.day)}-${date.year}`;
    this.loadDates(newDate);
    this.bookingData.therapist = {
      _id: e._id,
      firstName: e?.firstName,
      lastName: e?.lastName,
      image: e?.image,
      gender: e?.gender,
      requested_staff: true
    }
    setTimeout(() => {
      this.reload = true;
      this.selectedTime(date, true);
    }, 0);
  }
  loadTherapists() {
    return this.service.get(`get_therapist?location_id=${this.locationId}&shop_owner=${this.ownerId}&service=${this.serviceId}`)
    .subscribe(data => {
      this.therapists = data.result
    })
  }
  refreshCalendar = true;
  navigateDate(e) {
    let splitDateTime = e.split('T');
    let getDate = splitDateTime[0].split('-');
    let date = {
      year: parseInt(getDate[0]),
      month: parseInt(getDate[1]),
      day: parseInt(getDate[2])
    };
    this.model = date;
    this.refreshCalendar = false;
    this.dateSelected(date)
  }
  defaultImg(e, gender) {
    let defaultPic = '';
    defaultPic = gender === 'Male' ? './assets/images/male-therapist.svg' : './assets/images/female-therapist.svg';
    return e.target.src = defaultPic;
  }
}
