import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  PaymentIntent,
  StripeCardElementOptions,
  StripeCardNumberElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  isDisabledCard=true;
  creditCard: any;
  showDetail: any = 'card';

  cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        color: '#303238',
        fontSize: '16px',
        fontFamily: '"Open Sans", sans-serif',
        // border: '1px solid #303238',
        padding: '20px 0px',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#CFD7DF',
        },
      },
      invalid: {
        color: '#e5424d',
        ':focus': {
          color: '#303238',
        },
      },
    },
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  shopName: any;
  serviceName: any;
  serviceTime: any;
  servicePrice: any;
  therapistName: any;
  timeSlot: any;
  serviceId: any;
  therapistId: any;
  walletBalance: any;
  loyalityPoint: any;
  loginData: any;
  locationId: any;
  loyaltyPointCanRedeem: any;
  loyaltyPointRecieve: any;
  day: string = "";
  hour: string = "";
  date: any;
  ownerId: any;
  ownerid: any;
  nextHour: any;
  servicePricingName: any;
  durationHour: any;
  durationMin: any;
  startDate: any;
  endDate: any;
  intakeId: any;
  stripeId: any;
  tokenId: any;
  traxnId: any;

  // stripeTest: FormGroup;

  constructor(
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private stripeService: StripeService,
    private active:ActivatedRoute,
    private service:ApiServicesService,
    private route:Router,
    private newToast:ToasterService
  )
   {

     
   }

  ngOnInit(): void {
    this.stripeClient();
    this.active.queryParams.subscribe((params)=>{
      console.log(params);
      this.intakeId=params.intakeId
      this.durationHour=params.durationHour
      this.durationMin=params.durationMin
      this.startDate=params.startDate
      this.endDate=params.endDate
      this.ownerId=params.ownerId
      this.servicePricingName=params.servicePricingName
      this.loyalityPoint=params.loyalityPoint
      this.loyaltyPointCanRedeem = params['loyaltyPointCanRedeem'];
      this.loyaltyPointRecieve = params['loyaltyPointRecieve'];
      this.shopName=params.shopName,
      this. serviceName=params.serviceName,
      this. serviceTime=params.serviceTime,
      this. servicePrice=params.servicePrice,
      this. therapistName=params.therapistName,
      this. timeSlot=params.timeSlot,
      this.serviceId=params.serviceId,
      this.therapistId=params.therapistId,
      this.locationId=params.locationId
     });
    //  this.ownerid=JSON.parse(localStorage.getItem('shopSelected')!)
    //  this.ownerId=this.ownerid.ownerId
     console.log(this.timeSlot);
     
    //  to date format change //-//
    let now = moment(this.timeSlot).format("YYYY-MM-DD ");
    let now2 = moment(this.timeSlot).format("HH a");
    this.day = now;
    this.hour = now2;
    this.nextHour=(this.hour)+this.serviceTime
    // let now3 = moment(this.nextHour).format("HH a");

     console.log(now2);
     console.log(this.nextHour);
     

    this.date = moment(this.day, "YYYY-MM-DD ");
    console.log(this.date);
    
     this.loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
     console.log(this.loginData);
     
    this.walletBalance=(localStorage.getItem('walletbalance')!)
    // this.loyalityPoint=(localStorage.getItem('serviceSelected.services.pricing_option.specialPriceFor')!)
    console.log(this.walletBalance);
    
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  // createToken(): void {
  //   this.stripeService
  //     .createToken(this.card.element)
  //     .subscribe((result) => {
  //       if (result.token) {
  //         // Use the token
  //         console.log(result.token.id);
  //         this.stripeCheckout(result.token.id)
  //       } else if (result.error) {
  //         // Error creating the token
  //         console.log(result.error.message);
  //       }
  //     });
      
  // }

  // for client stripe Id
  stripeClient(){
    this.service.get(`customers/stripe_client`).subscribe((res)=>{
      console.log(res);
      this.stripeId=res.result.id
      
    },(err)=>{
      this.newToast.error("something went wrong")
    })
  }


    //  for stripe token create
    createToken(): void {
      this.stripeService
        .createToken(this.card.element)
        .subscribe((result) => {
          if (result.token) {
            this.tokenId=result.token.id
            // Use the token
            this.checkOut();
            console.log(this.tokenId);
          } else if (result.error) {
            // Error creating the token
            console.log(result.error.message);
          }
        });
        
    }

  // stripeCheckout(token:any) {
  //   this.service.get(`customers/stripe_checkout`).subscribe((res)=>{
  //     console.log(res);
  //     this.stripeId=res.result.id
  //     this.createToken();
  //   },(err)=>{
  //     this.newToast.error("something went wrong")
  //   })
  // }

  // 
  checkOut(){
    let data={
      "amount":Number(this.servicePrice),
      "currency":"usd",
      "stripeId":this.stripeId,
      "token":this.tokenId
    }
    console.log(data);
    this.service.post('customers/stripe_checkout', data).subscribe((res:any)=>{
      console.log(res);
      if(res.status==200){
        this.traxnId=res.result.balance_transaction
        this.pay()
      }
      
    },(err)=>{
      this.newToast.error("something went wrong")
    })
    

  }

  

  // completePayment() {
  //   this.stripeClient();
  // }

  

  selectPaymentType(type: string) {
    this.showDetail = type;
    console.log(this.showDetail);
    
  }

// after mode selection , card payment , verify 
  verifyCard(){



    // method call of api after mode of payment verified and got transaction id
    // this.pay(content:any) 

  }
  // api of payment for booking appointment 
  pay() {
    // console.log(this.timeSlot)
    console.log(this.date);
    let data=[{
    "bookedBy": {
        "id":this.loginData.result._id,
        "name": this.loginData?.result.firstName ,
        "type": "client"
    },
    "bookedFrom": "PWA",
    "client": this.loginData.client,
    "day": this.date.format().split('T')[0],
    "duration": {
        "hour": this.durationHour,
        "min": this.durationMin
    },
    "endTime": this.endDate,
    "location": this.locationId,
    "ownerId": this.ownerId,
    "intakId":this.intakeId,
    "payment": [
        {
            "amount": this.servicePrice ? this.servicePrice : 0,
            "currency": "usd",
            "name": "cash",
            "transactionId":this.traxnId
        }
    ],
    "price": this.servicePrice,
    "service": {
        "id": this.serviceId,
        "loyaltyPointCanRedeem": this.loyaltyPointCanRedeem,
        "loyaltyPointRecieve": this.loyaltyPointRecieve,
        "name": this.serviceName
    },
    "service_pricing_name": this.servicePricingName,
    "staff": {
        "firstName": this.therapistName,
        "id": this.therapistId,
        "lastName": ""
    },
    "startTime": this.startDate,
    "walkIn": false
}]
  console.log("My booking appointmnet data=====>>>>", data);
  this.service.post(`customers/appointment/book`,data).subscribe((res)=>{
    console.log(res);
    if(res){
      //  this.openVerticallyCentered()
      
      // this.modalService.open(content, {centered:true})
      // this.goToHome();
      this.route.navigate(['/'])
    }
    if(res.status==400){
      this.newToast.warning("session timeout")
    }
    
  },(err)=>{
    this.newToast.error("something went wrong")
  })
    }
   
    // to open confirmation booking modal
    goToHome(){
      this.modalService.dismissAll();
      this.route.navigate(['/'])
    }
}
