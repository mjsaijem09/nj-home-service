import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgetPasswordFrom!:UntypedFormGroup;
  submitted:boolean=false
  apiOtp: any;
  isLoading : boolean = false;
  isMobile: boolean = false;
  constructor(private router:Router,
     private service:ApiServicesService,
     private newToast:ToasterService,
     private modal: NgbModal,
     private bookingService: BookingService
     )
   {
    this.forgetPasswordFrom= new UntypedFormGroup({
      'email':new UntypedFormControl('',Validators.compose([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]))
    })
   }

  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();
  }

  // for forget password api
  onSubmit(e){
    this.submitted=true;
    var data={
      "email":this.forgetPasswordFrom.value.email
    }
    if(this.forgetPasswordFrom.valid){
      this.service.post(`forgetpass`, data)
      .subscribe(
        res=>{
        if(res.status == 200){
          this.modal.open(e, { centered: true })
          // this.apiOtp=res.otp
          // this.router.navigate(['auth/verify-otp'],{queryParams:{apiOtp:this.apiOtp,email:data.email}})
        }
        },(err)=>{
          this.newToast.error("Email you entered was not yet registered.")
        }
      )
    }
  }

  close() {
    this.modal.dismissAll();
    this.router.navigate(['auth/login'],{queryParams:{email:this.forgetPasswordFrom.value.email}});
  }


  // convenience getter for easy access to form fields
  get f() { return this.forgetPasswordFrom.controls; }


  // routing
  navigateToSignin(){
    this.router.navigateByUrl('auth/login')
  }
  navigateBack(){
  this.router.navigateByUrl('auth/login')

}
}
