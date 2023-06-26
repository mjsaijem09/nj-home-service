import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  submitted: boolean = false;
  verificationCode: string;
  userData
  previousUrl
  verified: boolean = false;
  constructor(
    private _router: Router,
    private _api: ApiServicesService,
    private newToast:ToasterService,
    private authService:AuthServiceService,
    public location: Location,
    ) 
    {
      this.previousUrl = this._router.getCurrentNavigation()?.extras?.state?.previous_url
      console.log("this.previousUrl", this.previousUrl);
    }
  ngOnInit(): void {
    this.userData = this.authService.getUserData().result;
    this.verified = this.userData.verified;
    if (this.verified) {
    } else {
      this.sendOTP();
      this.countDownResendOTP();
    }
  }
  
  waitfor: number = 30;
  resentOTP() {
    this.sendOTP();
    this.waitfor = 30;
    this.countDownResendOTP();
  }
  countDownResendOTP() {
    let countDownInterval = setInterval(() => {
      this.waitfor--
      if (this.waitfor == 0) clearInterval(countDownInterval);
    }, 1000);
  }
  sendOTP() {
    this._api.put('verify').subscribe(
      res => {
        console.log(res);
        this.newToast.success(res.message);
      }
    )
  }
  disabled: Boolean = false;
  verifyOTP(e) {
    if(e.length == 6) {
      this.disabled = true;
      let payload = {otp: e.toString()}
      this._api.put('verifyAccount', payload).subscribe(
        res => {
          console.log(res);
          if(res.message == "Account Verification Success") {
            this.initClient();
          } else {
            this.disabled = false;
            this.newToast.error(res.message);
          }
        }
      )
    }
  }
  initClient() {
    this._api.get(`find_by_email?email=${this.userData.email}`).subscribe(
      res => {
        console.log("res.customer.verified: ", res.result.verified);
        if (res.result.verified) {
          this.updateCustomerCookie();
          this._router.navigate([this.previousUrl ? this.previousUrl : "/"])
          this.newToast.success(res.message);
        }
      }
    )
  }
  updateCustomerCookie() {
    let userData = this.authService.getUserData();
    userData.result.verified = true;
    this.setCookie('customerLogin', JSON.stringify(userData))
  }

  setCookie(name, value) {
    const extraDays = 6;
    var d = new Date();
    d.setTime(d.getTime()+(extraDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    if(document.domain === 'localhost') {
      document.cookie = name +'='+ value +'; path=/; '+ expires + ';';
    } else {
      document.cookie = name +'='+ value +'; domain=.thebookus.com; path=/; '+ expires + ';';
    }
  }
}
