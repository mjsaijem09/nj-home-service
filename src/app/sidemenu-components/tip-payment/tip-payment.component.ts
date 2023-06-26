import { Component, OnInit, ViewChild } from '@angular/core';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  PaymentIntent,
  StripeCardElementOptions,
  StripeCardNumberElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { timeInterval, timeout } from 'rxjs/operators';
@Component({
  selector: 'app-tip-payment',
  templateUrl: './tip-payment.component.html',
  styleUrls: ['./tip-payment.component.scss']
})
export class TipPaymentComponent implements OnInit {
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

  constructor(
    private stripeService: StripeService,
    private active:ActivatedRoute,
    private service:ApiServicesService,
    private route:Router,
    private newToast:ToasterService
  ) 
  { 
    this.active.queryParams.subscribe((params)=>{
    this.amount=params.amount
    this.tipCardId=params.tipCard

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
          this.checkOut();
          console.log(this.tokenId);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
      
  }

  // 
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
        this.paymentFortip()
      }
      
    },(err)=>{
      this.newToast.error("something went wrong")
    })
    

  }
  // final payment for strip to buy tip card
  paymentFortip(){ 
    let data= {
      "clientId":this.clientId.client,
    "payment":[
      {"amount":Number(this.amount),
      "currency":"usd",
      "name":"stripe",
      "transactionId":this.traxnId
    }
    ],
    "tipcard":this.tipCardId
  }
  console.log("fgdfgf", data);
  this.service.post(`customers/buy_tip_card`,data).subscribe((res)=>{
    console.log(res);
    if(res.status==200){
      this.newToast.success("tipcard purchase successfully");
      this.route.navigate(['/nav/my-backpack'])
    }
    
  },(err)=>{
    this.newToast.error("something went wrong")
  })
  }

}
