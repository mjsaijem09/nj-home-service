import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-gift-payment',
  templateUrl: './gift-payment.component.html',
  styleUrls: ['./gift-payment.component.scss']
})
export class GiftPaymentComponent implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  isDisabledCard=true;
  creditCard: any;
  showDetail: any = 'card';
  clientId=this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)

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
  amount: any;
  stripeId: any;
  tokenId: any;
  traxnId: any;
  tipCardId: any;
  firstName: any;
  lastName: any;
  email: any;
  relation: any;
  mobile: any;
  date: any;
  to: any;
  from: any;
  giftCardId: any;
  giftColor: any;
  receiverEmail: any;
  receiverPhone: any;
  giftImage: any;
  senderEmail: any;
  write: any;

  constructor(
    private stripeService: StripeService,
    private active:ActivatedRoute,
    private service:ApiServicesService,
    private route:Router,
    private newToast:ToasterService
  ) 
  { 
    this.active.queryParams.subscribe((params)=>{
      this.active.queryParams.subscribe((params)=>{
        this.firstName=params.firstName,
        this.lastName=params.lastName,
        this.email=params.email,
        this.relation=params.relation,
        this.mobile=params.mobile,
        this.amount=params.amount,
        this.date=params.date,
        this.to=params.to,
        this.from=params.from,
        this.giftCardId=params.giftCardId,
        this.giftColor=params.giftColor,
        this.senderEmail=params.senderEmail,
        this.receiverEmail=params. receiverEmail,
        this.receiverPhone=params.receiverPhone,
        this.giftImage=params.giftImage,
        this.write=params.write
      });

    })
  }

  ngOnInit(): void {
    this.stripeClient();
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

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
          // this.checkOut();
          console.log(this.tokenId);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
      
  }

  
  checkOut(){
    let data={
      "amount":Number(this.amount),
      "currency":"usd",
      "stripeId":this.stripeId,
      "token":this.tokenId
    }
    console.log(data);
    this.service.post('customers/stripe_checkout', data).subscribe((res:any)=>{
      console.log(res);
      if(res.status==200){
        this.traxnId=res.result.balance_transaction
        // this.newToast.success("")
        this.paymentForGift()
      }
      
    },(err)=>{
      this.newToast.error("something went wrong")
    })
    

  }
  
  // final payment for stripe to send gift card
  paymentForGift(){ 
    let data= {
      "amount":this.amount,
      "clientId":this.clientId.client,
      "colorCode":this.giftColor,
      "date":this.date,
      "email":this.senderEmail,
      "giftImage":this.giftImage,
      "message":{
        "from":this.from,
        "giftCardId":this.giftCardId,
        "message":this.write,
        "reciever_email":this.receiverEmail,
        "reciever_phone":this.receiverPhone,
        "to":this.to
      },
      "mobile":this.mobile,
      "payment":[{
        "amount":this.amount,
        "currency":"usd",
        "name":"stripe",
        "transactionId":this.traxnId
      }],
      "redeemStatus":false,
      "relation":this.relation,
      "sent":true
    }
     
  console.log("fgdfgf", data);
  this.service.post(`customers/giftacard?invoice=${'TA1845UQ'}&email=${this.senderEmail}`,data).subscribe((res)=>{
    console.log(res);
    if(res.status==200){
      this.newToast.success("tipcard purchase successfully");
      this.route.navigate(['/nav/my-relationship'])
    }
    
  },(err)=>{
    this.newToast.error("something went wrong")
  })
  }

}

