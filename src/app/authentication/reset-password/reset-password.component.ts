import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ConfirmPasswordValidator } from '../confirm-password.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild(NgbDatepicker) d: NgbDatepicker;
  form: UntypedFormGroup;
  submitted: boolean=false;
  email: any;
  customerId: any;
  apiOtp: any;
  selectedGender: any;
  year = new Date().getFullYear();
  month = new Date().getMonth() + 1;
  day = new Date().getDate() - 1;
  constructor(private active:ActivatedRoute,
    private service:ApiServicesService,
    private router:Router,
    private fb:UntypedFormBuilder,
    private newToast:ToasterService
    ) {
    this.form = fb.group({
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(8)]),
      confirmpassword: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required]),
      dob: new UntypedFormControl(null),
      street: new UntypedFormControl(''),
      area: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      zip: new UntypedFormControl(''),
    },
    {
      validator: ConfirmPasswordValidator("password", "confirmpassword")
    }
    );

    this.active.queryParams.subscribe((params)=>{
      this.email=params.email;
      this.apiOtp=params.apiOtp
      this.customerId = params.customerId
    })

    this.form.patchValue({
      email: this.email,
    })

   }

  ngOnInit(): void {
  }

  // api to reset password
  confirm(){
    this.submitted=true

    let data={
      'email':this.email,
      // 'otp':this.apiOtp,
      'password':this.form.value.password
    }
    if(this.form.valid){
      this.service.post(`resetpass`,data).subscribe((res:any)=>{
        if(res.status==200){
          this.newToast.success(res.message)
          let data = res.result;
          this.router.navigate(['auth/login'],{queryParams:{email:data.email,password:this.form.value.password}});
        } 
      },(err)=>{
        this.newToast.error("something went wrong")
      })
    }

  }
  generatePassword(){
    this.submitted=true

    const data = {
      email: this.email,
      password: this.form.value.password,
    }
    if(this.form.valid){
      this.service.put(`update_password/`+this.customerId,data).subscribe((res:any)=>{
      if(res.status==200){
        this.newToast.success(res.message)
        this.router.navigate(['auth/login'], {
          state: { accountSetup: 'success' }
        });
      } 
      },(err)=>{
        this.newToast.error("something went wrong")
      })
    }

  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  navigateBack(){
    this.router.navigateByUrl('auth/forgot-password')
  
  }
}
