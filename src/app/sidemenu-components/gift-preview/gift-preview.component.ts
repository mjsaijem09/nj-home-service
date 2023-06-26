import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, NgModel, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gift-preview',
  templateUrl: './gift-preview.component.html',
  styleUrls: ['./gift-preview.component.scss']
})
export class GiftPreviewComponent implements OnInit {
  addRelationForm:UntypedFormGroup;
  submitted = false
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
  giftColor: any;
  receiverEmail: any;
  receiverPhone: any;
  giftImage: any;
  senderEmail: any;
  colorType: any;
  write: any;

  constructor(private router:Router,
    private active:ActivatedRoute,
    private modalService: NgbModal,
    ) 
  {
    this.addRelationForm = new UntypedFormGroup({
      
      mobile: new UntypedFormControl('', Validators.required),
      email: new UntypedFormControl('', Validators.required),

    });
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
        this.senderEmail=params.senderEmail
        this.receiverEmail=params. receiverEmail,
        this.receiverPhone=params.receiverPhone,
        this.giftImage=params.giftImage,
        this.colorType=params.colorType,
        this.write=params.write

      });

      this.addRelationForm.patchValue({
        email:this.email,
        mobile:this.mobile
      })
   }
    // convenience getter for easy access to form fields
  get f() { return this.addRelationForm.controls; }

  onSubmit(){
  }


  ngOnInit(): void {
  }

  Cancel(content:any){
    this.modalService.open(content, {centered:true})

  }
  confirm(){
    this.router.navigate(['/nav/gift-payment'],{queryParams:{
      firstName:this.firstName,
      lastName:this.lastName,
      email:this.email,
      relation:this.relation,
      mobile:this.mobile,
      amount:this.amount,
      date:this.date,
      to:this.to,
      from:this.from,
      giftCardId:this.giftCardId,
      giftColor:this.giftColor,
      senderEmail:this.senderEmail,
      receiverEmail:this. receiverEmail,
      receiverPhone:this.receiverPhone,
      giftImage:this.giftImage,
      write:this.write

    }})

  }
  // to open confirmation booking modal
  goToHome(){
    this.modalService.dismissAll();
    this.router.navigate(['/'])
  }

}
