import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.scss']
})

export class VerifyPhoneComponent implements OnInit {

  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  otp: any;
  apiOtp: any;
  email: any;
  constructor(
    public router:Router,
    private service:ApiServicesService,
    private newToast:ToasterService,
    private auth:AuthServiceService
  ) {}

  ngOnInit(): void {
    this.getUserData()
  }
  getUserData() {
    let userData = this.auth.getUserData();
    console.log("userData: ",userData);
    this.email = userData.result.email;
    this.resend();
  }
  onOtpChange(otp:any){
    this.otp = otp;
  }
  resend() {
  }
}
