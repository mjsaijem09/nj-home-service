import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-gift-reciever-detail',
  templateUrl: './gift-reciever-detail.component.html',
  styleUrls: ['./gift-reciever-detail.component.scss']
})
export class GiftRecieverDetailComponent implements OnInit {
  addRelationForm:UntypedFormGroup;
  submitted = false
  loginData: any;
  clientId: any;
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
  
  constructor(private NgbModal:NgbModal,
    private newToast:ToasterService,
    private service:ApiServicesService,
    private route:Router,
    private active:ActivatedRoute
    ) { 
    this.addRelationForm = new UntypedFormGroup({
      firstName: new UntypedFormControl('', Validators.required),
      lastName: new UntypedFormControl('', Validators.required),
      amount: new UntypedFormControl('', Validators.required),
      relation: new UntypedFormControl('', Validators.required),
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
      this.giftImage=params.giftImage
      console.log("cdcsd");
      
    })

  }
  // convenience getter for easy access to form fields
  get f() { return this.addRelationForm.controls; }

  onSubmit(){

  }
  
  ngOnInit(): void {
    this.dataPatch()
  }

  dataPatch(){
    this.addRelationForm.patchValue({
      firstName:this.firstName,
      lastName:this.lastName,
      email:this.email,
      relation:this.relation,
      mobile:this.mobile,
      amount:this.amount
    })
  }
  
  // routing

  goToLetterType(){
    this.route.navigate(['/nav/select-letter'],{queryParams:{
      firstName:this.firstName,
      lastName:this.lastName,
      email:this.addRelationForm.value.email,
      relation:this.relation,
      mobile:this.mobile,
      amount:this.amount,
      date:this.date,
      from:this.from,
      to:this.to,
      giftCardId:this.giftCardId,
      giftColor:this.giftColor,
      senderEmail:this.senderEmail,
      receiverEmail:this. receiverEmail,
      receiverPhone:this.receiverPhone,
      giftImage:this.giftImage

    }})
  }
  navigateBack(){
    this.route.navigate(['/nav/my-relationship'])
  }
  selectGender(content:any) {
    this.NgbModal.open(content, { centered: true });
  }
  selectRelation(content:any){
    this.NgbModal.open(content, { centered: true });
  }

}
