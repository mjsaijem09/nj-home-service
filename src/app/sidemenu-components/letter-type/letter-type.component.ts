import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-letter-type',
  templateUrl: './letter-type.component.html',
  styleUrls: ['./letter-type.component.scss']
})
export class LetterTypeComponent implements OnInit {
  giftForm!:UntypedFormGroup
  giftColor: any;
  firstName: any;
  lastName: any;
  email: any;
  relation: any;
  mobile: any;
  amount: any;
  date: any;
  to: any;
  from: any;
  giftCardId: any;
  receiverEmail: any;
  receiverPhone: any;
  giftImage: any;
  colorType: any = 'pink';
  senderEmail: any;
  constructor(public router:Router,
    private active:ActivatedRoute) 
    {
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
        this.giftImage=params.giftImage
      })
     }

  ngOnInit(): void {
    this.giftForm= new UntypedFormGroup({
      write: new UntypedFormControl('')
    });

  }

  cardselect(cardColor:any, colorType: any){
    this.colorType = colorType;
    this.giftColor=cardColor
    console.log(this.colorType);
    

  }
  skipLetter(){
    this.router.navigate(['/nav/gift-preview'],{queryParams:{
      firstName:this.firstName,
      lastName:this.lastName,
      email:this.email,
      relation:this.relation,
      mobile:this.mobile,
      amount:this.amount,
      date:this.date,
      from:this.from,
      to:this.to,
      giftCardId:this.giftCardId,
      giftColor:this.giftColor,
      colorType:this.colorType,
      senderEmail:this.senderEmail,
      receiverEmail:this. receiverEmail,
      receiverPhone:this.receiverPhone,
      giftImage:this.giftImage
    }})
  }
  withLetter(){
    this.router.navigate(['/nav/gift-preview'],{queryParams:{
      firstName:this.firstName,
      lastName:this.lastName,
      email:this.email,
      relation:this.relation,
      mobile:this.mobile,
      amount:this.amount,
      date:this.date,
      from:this.from,
      to:this.to,
      giftCardId:this.giftCardId,
      giftColor:this.giftColor,
      colorType:this.colorType,
      senderEmail:this.senderEmail,
      receiverEmail:this. receiverEmail,
      receiverPhone:this.receiverPhone,
      giftImage:this.giftImage,
      write:this.giftForm.value.write

    }})
  }

}
