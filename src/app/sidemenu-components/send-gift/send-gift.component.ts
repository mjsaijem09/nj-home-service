import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-send-gift',
  templateUrl: './send-gift.component.html',
  styleUrls: ['./send-gift.component.scss']
})
export class SendGiftComponent implements OnInit {
  clientId=this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)

  isDisabled: boolean=true;
  selected: any;
  giftData: any=[];
  relationdata: any={};
  firstName: any;
  lastName: any;
  email: any;
  mobile: any;
  relation: any;
  giftCardId: any;
  amount: any;
  senderEmail: any;
  receiverEmail: any;
  receiverPhone: any;
  date: any;
  from: any;
  to: any;
  giftImage: any;
  giftColor: any;

  constructor(private router:Router,
    private service:ApiServicesService,
    private newToast:ToasterService,
    private active:ActivatedRoute ) 
    {
      this.active.queryParams.subscribe((params)=>{
        this.firstName=params.firstName,
        this.lastName=params.lastName,
        this.email=params.email,
        this.relation=params.relation,
        this.giftCardId=params.giftCardId
        // this.mobile=params.mobile,

        console.log("cdcsd", this.relationdata);
        
      })
     }

  ngOnInit(): void {
    this.giftCardList()
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // gift card listing
  giftCardList(){
    this.service.get(`customers/findmygiftcard?clientId=${this.clientId.client}&sent=false&received=true`).subscribe((res)=>{
      console.log(res);
      if(res.status==200){
        this.giftData=res.result;
      }
      
    },(err)=>{
      this.newToast.error("something went wrong")
    })
  }
  // method for the select gift card
  select(item:any){
    console.log(item);
    
    if(item._id){
      this.isDisabled=false
      this.selected=item._id;
    }
    this.amount=item.amount,
     this.senderEmail=item.email,
     this.receiverEmail=item.message.reciever_email,
     this.receiverPhone=item.message.reciever_phone,
     this.mobile=item.mobile,
     this.amount=this.amount,
     this.date=item.date,
     this.from=item.message.from,
     this.to=item.message.to,
     this.giftImage=item.giftImage,
     this.giftColor=item.giftColor

    console.log("dfd", this.selected);
    
  }
  // routing
  recieverDetails(item:any){
    console.log(item);
    
    this.router.navigate(['/nav/gift-receiver'],{queryParams:{
      firstName:this.firstName,
      lastName:this.lastName,
      email:this.email,
      senderEmail:this.senderEmail,
      receiverEmail:this.receiverEmail,
      receiverPhone:this.receiverPhone,
      relation:this.relation,
      mobile:this.mobile,
      amount:this.amount,
      date:this.date,
      from:this.from,
      to:this.to,
      giftCardId:this.giftCardId,
      giftImage:this.giftImage,
      giftColor:this.giftColor

    }})

  }

}
