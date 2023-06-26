import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import * as momentTz from 'moment-timezone';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { GiftcardService } from '../giftcard.service';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-purchase-giftcard',
  templateUrl: './purchase-giftcard.component.html',
  styleUrls: ['./purchase-giftcard.component.scss']
})
export class PurchaseGiftcardComponent implements OnInit {
  @ViewChild('content') content: ElementRef<HTMLElement> | any;
  @Output() requestData : EventEmitter<any> = new EventEmitter();
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  selectedCountryISO = CountryISO.Australia;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  subscription: Subscription;
  card: any;
  message: any;
  sender: any;
  receiver: any;
  receiverEmail: any;
  receiverPhone: any;
  loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
  dateTime: any;
  isDisabled = false;
  // Modals
  selectCardForPaymentModal: NgbModalRef | undefined;
  importantNote: NgbModalRef | undefined;
  public imgBaseUrl = environment.image_url;
  processingFee: any;
  total_amount: any;
  isMobile: boolean = false;
  option: string;
  placement = 'bottom';
  date: NgbDateStruct;
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
  ]
  minDate
  hour;
  minute;
  meridiem;
  constructor(
    private modalService: NgbModal,
    private route: Router,
    private gc: GiftcardService,
    private _http: ApiServicesService,
    private toast: ToasterService,
    private location: Location,
  ) {
    const current = new Date();
    this.date = {year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate()};
  }

  ngOnInit(): void {
    this.isMobile = this.gc.isMobileView();
    this.subscription = this.gc.getGiftcardDetails()
    .subscribe((details: any) => {
      console.log(details);
      this.card = details;
      this.sender = this.loginData?.result?.firstName ? this.loginData?.result?.firstName : '';
      this.receiver = details.receiver?.firstName ? details.receiver?.firstName : '' + details.receiver?.lastName ? details.receiver?.lastName : '';
      this.message = details.letter.message;
      this.receiverEmail = details.receiver?.email ? details.receiver?.email : '';
      this.receiverPhone = details.receiver?.phone ? details.receiver?.phone : '';
      console.log(details.deliverDate.date);
      if(details.deliverDate.date != 'Send Directly') {
        this.date = details.deliverDate.date;
        let date = `${details.deliverDate.date}`;
        let time = momentTz(`${details.deliverDate.time}`.toString(), "HHmm").format('LT');
        this.dateTime = `${date} ${time}`;
        this.option = 'send_later';
        console.log(this.option);
        this.hour = details.deliverDate.time.hour;
        this.minute = details.deliverDate.time.minute;
        this.meridiem = details.deliverDate.time.meridiem;
      } else {
        this.dateTime = 'Send Directly';
        this.option = 'send_now';
      }
    });
    console.log(this.card)
    if(!this.card?.shopDetails?.ownerid) {
      this.route.navigate(['/']);
    }
    this.getProcessingFee()
  }
  
  cardOutput(e) {
    this.getProcessingFee()
  }
  getProcessingFee() {
    let amount = this.card?.card?.giftcard_value.replace("$", "");
    amount = parseInt(amount)+this.card?.card?.price;
    this._http.get(`get_processing_fee?amount=${amount}`)
    .subscribe(res => {
      this.processingFee = res.processingFee;
      this.total_amount = res.total_amount;
    })
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  sendOption(e) {
    this.option = e;
    this.resetTime()
  }
  resetTime() {
    this.hour = this.hours[11].hour;
    this.minute = this.minutes[0].min;
    this.meridiem = 'am';
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}
  
  openVerticallyCentered(content:any) {
    this.modalService.open(content, { centered: true }).result.then((result) => {
      console.log("result", result)
      this.requestData.emit(true)
    }, (reason) => {
      console.log("reason", reason)
    });
  }
  confirm(importantNote){
    this.importantNote = this.modalService.open(importantNote, { centered: true });
  }
  confirmWithCard(paymentMethod){
    this.importantNote.close()
    this.selectCardForPaymentModal = this.modalService.open(paymentMethod, { centered: true });
  }
  back() {
    this.location.back();
  }
  sendFromDesktop = false;
  newHour
  next(importantNote) {
    let theTime = `${this.hour}:${this.minute} ${this.meridiem}`
    const [time, modifier] = theTime.split(' ');
    let [hours, minutes]: any = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'pm') {
      hours = parseInt(hours, 10) + 12;
    }
    let newHour = hours.length < 2 ? '0' + hours: hours;
    let newMinute = minutes.length < 2 ? '0' + minutes: minutes;
    this.newHour = `${newHour}:${newMinute}`
    this.sendFromDesktop = true;
    this.importantNote = this.modalService.open(importantNote, { centered: true });
  }
  
  confirmPurchase() {
    this.isDisabled = true;
    let payload = {
      "amount": this.total_amount,
      "processingFee": this.processingFee,
      "currency": "aud",
      "description": "Purchase giftcard from BookUs Web App",
      "metadata": {
        "from": this.sender,
        "message": this.message,
        "theme": this.card?.card.name,
        "reciever_email": this.receiverEmail,
        "reciever_phone": this.receiverPhone,
        "to": this.receiver,
      }
    };
    console.log(payload);
    this._http.post(`giftcard_checkout?ownerId=${this.card?.shopDetails?.ownerid}`,payload)
    .subscribe(
      res => {
        if (res['status'] == 200) {
          this.sales(res['result'])
        } else {
          this.toast.error(res.body);
        }
      },
      err => {
        this.toast.error(err.body);
        console.log(err.body)
      }
    )
  }
  sales(res) {
    let payload = {
      "voucher": [
          {
          "_type":"Gift Voucher",
          "value": this.card?.card?.giftcard_value.replace("$", ""),
          "expiryPeriod":"1 Year",
          "amount": this.card?.card?.giftcard_value.replace("$", ""),
          "quantity":1,
          "discount":0,
          "staff":{
              "_id":"5fc78dd88d1b250012c39fb1",
              "firstName":"Nimrat",
              "lastName":"Singh"
          },
          "commission":0,
          "service":null,
          "duration":null
          }
      ],
      "totalAmount": this.card?.card?.giftcard_value.replace("$", ""),
      "tips":[],
      "payment":[
          {
          "name":"stripe",
          "amount": this.card?.card?.giftcard_value.replace("$", "")
          }
      ],
      "location": this.card?.shopDetails?.locationId,
      "category":"voucher",
      "ownerId": this.card?.shopDetails?.ownerid,
    }
    let sales = res;
    this._http.post(`gift_sales`, payload)
    .subscribe(res => {
      if (res['status'] == 200) {
        this.sendGiftcard(res['result'], sales)
      } else {
        
      }
    })
  }
  
  getLocalTimeZone() {
    let offset = (new Date()).getTimezoneOffset();
    let timezones = {
      '-12': 'Pacific/Kwajalein',
      '-11': 'Pacific/Samoa',
      '-10': 'Pacific/Honolulu',
      '-9': 'America/Juneau',
      '-8': 'America/Los_Angeles',
      '-7': 'America/Denver',
      '-6': 'America/Mexico_City',
      '-5': 'America/New_York',
      '-4': 'America/Caracas',
      '-3.5': 'America/St_Johns',
      '-3': 'America/Argentina/Buenos_Aires',
      '-2': 'Atlantic/Azores',
      '-1': 'Atlantic/Azores',
      '0': 'Europe/London',
      '1': 'Europe/Paris',
      '2': 'Europe/Helsinki',
      '3': 'Europe/Moscow',
      '3.5': 'Asia/Tehran',
      '4': 'Asia/Baku',
      '4.5': 'Asia/Kabul',
      '5': 'Asia/Karachi',
      '5.5': 'Asia/Calcutta',
      '6': 'Asia/Colombo',
      '7': 'Asia/Bangkok',
      '8': 'Asia/Singapore',
      '9': 'Asia/Tokyo',
      '9.5': 'Australia/Darwin',
      '10': 'Pacific/Guam',
      '11': 'Asia/Magadan',
      '12': 'Asia/Kamchatka'
    };
    return timezones[-offset / 60];
  }
  

  deliveryDate() {
    if (this.sendFromDesktop) {
      let date = `${this.card?.deliverDate.date.year}-${this.card?.deliverDate.date.month}-${this.card?.deliverDate.date.day}`;
      let deliverDate = momentTz.tz(`${date} ${this.newHour}`, this.getLocalTimeZone()).toISOString();
      console.log("deliverDate: ", deliverDate);
      return deliverDate;
    } else {
      let date = `${this.card?.deliverDate.date}`;
      let time = `${this.card?.deliverDate.time}`;
      let deliverDate = momentTz.tz(`${date} ${time}`, this.getLocalTimeZone()).toISOString();
      console.log("deliverDate: ", deliverDate);
      return deliverDate;
    }
    
  }
  currentDate(){
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return momentTz.tz(`${date} ${time}`, this.getLocalTimeZone()).format();
  }
  
  sendGiftcard(sales, res) {
    let payload = {
      clientId: this.loginData.client,
      amount: sales.totalAmount.toString(),
      colorCode: this.card?.letter.colorCode,
      email: this.loginData.result.email,
      giftImage: this.card?.card?.card,
      letter_bg: this.card?.card?.letter_bg,
      deliveryDate: sales.createdAt,
      message:{
          from: this.sender,
          giftCardId: sales.voucher[0].voucherId,
          message: this.message,
          reciever_email: this.receiverEmail,
          reciever_phone: this.receiverPhone,
          to: this.receiver
      },
      mobile: this.receiverPhone,
      payment:[
        {
        amount: sales.totalAmount.toString(),
        currency: 'aud',
        name: 'stripe',
        transactionId: res.id
        }
      ],
      redeemStatus:false,
      relation:null,
      sent:true
    }
    if(this.dateTime !== 'Send Directly') {
      payload.deliveryDate = this.deliveryDate();
    }
    this._http.post(`giftcard?invoice=${sales.invoice}&email=${this.receiverEmail}`, payload)
    .subscribe(res => {
      if (res.status == 200) {
        this.card.purchaseData = res.result
        this.selectCardForPaymentModal.close()
        this.route.navigate(['giftcard/complete-purchase']);
      } else {
        
      }
    })
  }
  cancel(){
    this.openVerticallyCentered(this.content)
  }
}
