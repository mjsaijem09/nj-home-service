import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, AbstractControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import {
  NgbCalendar,
  NgbDateParserFormatter,
  NgbDatepicker,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-send-request',
  templateUrl: './send-request.component.html',
  styleUrls: ['./send-request.component.scss'],
})
export class SendRequestComponent implements OnInit {
  @ViewChild('content') content: ElementRef<HTMLElement> | any;
  @ViewChild(NgbDatepicker) d: NgbDatepicker;
  @Input() private sendRequestData : any;
  @Output() requestData : EventEmitter<any> = new EventEmitter();
  model: NgbDateStruct | undefined;
  today = this.calendar.getToday();
  year = new Date().getFullYear();
  month = new Date().getMonth() + 1;
  day = new Date().getDate();
  orderForm: UntypedFormGroup | any;
  storeDetails: any;
  clientdata: any;
  name: any;
  number: any;
  email: any;
  notes = '';
  step1 = true;
  step2 = false;
  updateProfile = false;
  showError = false;
  setDefaultTime = '';
  bookingData: any;
  hours = [
    {hour: 1},
    {hour: 2},
    {hour: 3},
    {hour: 4},
    {hour: 5},
    {hour: 6},
    {hour: 7},
    {hour: 8},
    {hour: 9},
    {hour: 10},
    {hour: 11},
    {hour: 12}
  ];
  minutes = [
    {min: 0},
    {min: 5},
    {min: 10},
    {min: 15},
    {min: 20},
    {min: 25},
    {min: 30},
    {min: 35},
    {min: 40},
    {min: 45},
    {min: 50},
    {min: 55},
    {min: 60},
  ];
  subscribers: Subscription[];
  
  constructor(
    private calendar: NgbCalendar,
    private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private httpService: ApiServicesService,
    private bookingService: BookingService,
    public datepipe: DatePipe,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToasterService,
    private location: Location,
  ) {
    this.orderForm = this.fb.group({
      sched: this.fb.array([]),
    });
    this.subscribers = [];
  } 

  ngOnInit(): void {
    this.bookingData = this.bookingService.bookingData;
    this.clientdata = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
    if(!this.clientdata) {
      this.bookingData.pathUrl = '/send-request';
      this.router.navigate(['/auth/login']);
    } else {
      this.name = this.clientdata.result.firstName + ' ' + this.clientdata.result.lastName;
      this.number = this.clientdata.result.mobile;
      this.email = this.clientdata.result.email;
    }
    if(!this.bookingData || !this.bookingData.shop || !this.bookingData.shop.ownerId || !this.bookingData.shop.locationId) {
      this.location.back();
    }
    console.log(this.bookingData);
    this.addItem()
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  get schedArray() {
    return (this.orderForm.controls['sched'] as UntypedFormArray).controls as UntypedFormGroup[];
  }
  addItem(e?): void {
    let array = this.orderForm.controls['sched'] as UntypedFormArray;
    let item = this.fb.group({
      date: this.fb.control('', [Validators.required]),
      startTime: this.fb.control('', [Validators.required]),
      endTime: this.fb.control('', [Validators.required]),
    })
    if (e === 'btn') {
      console.log(this.orderForm.status)
      if(this.orderForm.status === 'VALID') {
        this.showError = false;
        array.push(item);
        this.handleChanges(array.controls[array.length - 1]);
      } else {
        this.showError = true;
        this.toastr.error('Please add date & time for continue!');
      }
    } else {
      array.push(item);
      this.handleChanges(array.controls[array.length - 1]);
    }
  }

  addMinutes(time) {
    console.log(time)
    const [newTime, modifier] = time.split(' ');
    let [hours, minutes]: any = newTime.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    let newHour = hours.length < 2 ? '0' + hours: hours;
    let newMinute = minutes.length < 2 ? '0' + minutes: minutes;
    let startTime = `${newHour}:${newMinute}:00`
    let endTime = moment(startTime, 'HH:mm:ss').add(this.bookingData.service.serviceDuration, 'minutes').format('h:mm A');
    console.log(endTime);
    return endTime;
  }
  
  handleChanges(control: AbstractControl) {
    this.subscribers.push(
      control.get('startTime').valueChanges.subscribe((time) => {
        console.log(time);
        control.get('endTime').patchValue(this.addMinutes(time));
        console.log(this.orderForm.value);
      })
    );
  }
  ngOnDestroy() {
    this.subscribers.forEach((sub) => {
      if (!sub.closed) sub.unsubscribe();
    });
  }
  
  next() {
    if(this.orderForm.status === 'VALID') {
      this.showError = false;
      this.step1 = false;
      this.step2 = true;
      this.orderForm.value.sched.forEach((ele:any) => {
        ele.date = `${ele.date.year}-${ele.date.month}-${ele.date.day}`;
        ele.date = moment(ele.date).format("YYYY-MM-DD");
        let startTime = `${ele.date}T${this.formatTime(ele.startTime)}`;
        let endTime = `${ele.date}T${this.formatTime(ele.endTime)}`;
        ele.endTime = endTime;
        ele.startTime = startTime ;
      });
      console.log("new",this.orderForm.value.sched);
    } else {
      this.toastr.error('Please add date & time for continue!');
      this.showError = true;
    }
  }
  formatTime(time) {
    console.log(time)
    const [newTime, modifier] = time.split(' ');
    let [hours, minutes]: any = newTime.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    let newHour = hours.length < 2 ? '0' + hours: hours;
    let newMinute = minutes.length < 2 ? '0' + minutes: minutes;
    return `${newHour}:${newMinute}:00.999Z`;
  }
  send(){
    let dateTime = []
    this.orderForm.value.sched.forEach(ele => {
      let item = {
        date: ele.date+'T00:00:00.000Z',
        time: {
          startTime: ele.startTime,
          endTime: ele.endTime
        }
      }
      dateTime.push(item);
    });
    let body = {
      locationId: this.bookingData?.shop?.locationId,
      clientId: this.clientdata.client,
      duration: this.bookingData?.service?.serviceDuration,
      price: this.bookingData?.service?.servicePrice,
      ownerId: this.bookingData?.shop?.ownerId,
      client: this.bookingData?.bookFor?.clientId,
      serviceId: this.bookingData?.service?.serviceId,
      therapistId: this.bookingData?.therapist?._id,
      date: dateTime,
      notes: this.notes
    };
    console.log(body)
     this.httpService.post(`appointment_request`,body).subscribe((res:any)=>{
       console.log(res)
       this.openVerticallyCentered(this.content)
     })
    
     if(this.updateProfile){
       const data = {
         firstName: this.name.split(' ')[0],
         lastName: this.name.split(' ')[1],
         mobile: this.number,
       }
       this.httpService.put(`update_profile?id=${this.clientdata.result._id}&clientId=${this.clientdata.client}`, data).subscribe((res: any) => {
         this.toastr.success(res.message)
         let customerDetails = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
         customerDetails.result = res.result;
         this.setCookie('customerLogin', JSON.stringify(customerDetails));
         this.httpService.setLoginData(customerDetails);
       })
     }
  }

  setCookie(name, value) {
    const extraDays = 6;
    var d = new Date();
    d.setTime(d.getTime()+(extraDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    if(document.domain === 'localhost') {
      document.cookie = name +'='+ value +'; path=/; '+ expires + ';';
    } else {
      document.cookie = name +'='+ value +'; domain=.thebookus.com; path=/; '+ expires + ';';
    }
  }
  
  openVerticallyCentered(content:any) {
    this.modalService.open(content, { centered: true }).result.then((result) => {
      console.log("result", result)
      this.requestData.emit(true)
    }, (reason) => {
      console.log("reason", reason)
    });
  }
  
}