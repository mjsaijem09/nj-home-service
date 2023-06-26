import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { from, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ConfirmPasswordValidator} from '../confirm-password.validator';
import { AuthService } from '../auth.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  registerForm: UntypedFormGroup;
  submitted: boolean = false;
  loginData: any={};
  map:any;
  lat:any;
  lng: any;
  isLoading : boolean = false;
  subscription: Subscription;
  registerData: any;
  hasClientId: any;
  isMobile: boolean = false;
  isOnSuccessRegistration: boolean = false;
  inviteId: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: Router,
    private service:ApiServicesService,
    private newToast:ToasterService,
    private activeRoute : ActivatedRoute,
    private modalService: NgbModal,
    private auth: AuthService,
    private bookingService: BookingService
  ) {
    this.GetCurrentLocation();

    this.registerForm = formBuilder.group({
      firstname: new UntypedFormControl(''),
      lastname: new UntypedFormControl(''),
      mobile: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      dialCode: new UntypedFormControl(''),
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(12)]),
      confirmpassword: new UntypedFormControl('', Validators.required),
      country: new UntypedFormControl('Australia', Validators.required),
      terms: new UntypedFormControl(false, Validators.requiredTrue),
    },
    {
      validator: ConfirmPasswordValidator("password", "confirmpassword")
    }
    );
    // this.loginData=JSON.parse(localStorage.getItem('customerLogin')!)

  }

  

  passwordMatchValidator(frm: UntypedFormGroup) {
    return frm.controls['password'].value ===
    frm.controls['confirmpassword'].value ? null : {'mismatch': true};
        }

  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();

    this.activeRoute.queryParams.subscribe(res=>{
      if (res && res.firstName) {
        this.registerForm.controls.firstname.setValue(res.firstName);
      }
      if (res && res.lastName) {
        this.registerForm.controls.lastname.setValue(res.lastName);
      }
      if(res && res.email){
        this.registerForm.controls.email.setValue(res.email);
      }
      if(res && res.countryCode){
        this.registerForm.controls.dialCode.setValue(res.countryCode);
      }
      if(res && res.mobile){
        this.registerForm.controls.mobile.setValue(res.mobile);
      }
      if(res && res.password){
        this.registerForm.controls.password.setValue(res.password);
        this.registerForm.controls.confirmpassword.setValue(res.password);
      }
      this.hasClientId = res.customerId;
    });
    this.subscription = this.auth.getRegisterData()
    .subscribe((details: any) => {
      this.registerData = details;
    });
    this.getParams()
  }
  
  
  // code to allow location permission
  public GetCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)  =>            {
         this.ShowLocation(position, this.map);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  private ShowLocation(position: any, map: any): void {
    this.lng = +position.coords.longitude;
    this.lat = +position.coords.latitude;
    console.log(position.coords.latitude);
  }



  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(content) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      this.validationMsg();
      return;
    }

    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value))
    // for sign up api
    else {
      let data = {
        "email":this.registerForm.value.email,
        "firstName":this.registerForm.value.firstname,
        // "geo_location":{
        //   "coordinates":[this.lat ,this.lng],
        //   "type":"Point"
        // },
        "lastName":this.registerForm.value.lastname,
        "mobile":this.registerForm.value.mobile.number,
        "countryStr" : this.registerForm.value.mobile.countryCode.toLowerCase(),
        "countryCode" : this.registerForm.value.dialCode ? this.registerForm.value.dialCode : this.registerForm.value.mobile.dialCode,
        "password":this.registerForm.value.password,
        "notifyBy":"Email",
        "createdFrom": 'pwa',
        "register_from": 'pwa'
      }
      if(this.registerForm.valid){
        if (!this.hasClientId) {
          let api_url = this.inviteId ? `register?code=${this.inviteId}` : `register` ;
          this.service.post(api_url ,data).subscribe((res:any)=>{
            if(res.status==200){
              this.newToast.success(res.message)
              // this.route.navigate(['auth/login']);
              this.registerData.data = data;
              // this.redirectLogin();
              // this.open(content)
              // this.route.navigateByUrl('/auth/login');
              if (this.isMobile) {
                this.isOnSuccessRegistration = true
              } else {
                this.route.navigate(['auth/login']);
                this.open(content)
              }
            }
            if(res.status==409){
              this.newToast.info("customer already register.")
              // customer already register
            }
            if(res.status==201 && res.message){
              this.newToast.info(res.message);
              // customer already register
            }
          },(err)=>{
            this.newToast.error("something went wrong")
          })
        } else {
          this.service.put(`update_password/${this.hasClientId}`, data)
          .subscribe( 
            res => {
              if(res.status==200){
                this.newToast.success(res.message)
                // this.route.navigate(['auth/login']);
                this.registerData.data = data;
                // this.open(content)
                if (this.isMobile) {
                  this.isOnSuccessRegistration = true
                } else {
                  this.route.navigate(['auth/login']);
                  this.open(content)
                }
              }
            }
          )
        }
      }
    }
  }
  validationMsg() {
    if(this.f.country.value === '') {
      this.newToast.error("Country is required")
    }
    if(this.f.email.value === '') {
      this.newToast.error("Email is required")
    }
    if(this.f.email.value !== '' && this.f.email.invalid) {
      this.newToast.error("Email is not valid")
    }
    if(this.f.mobile?.value?.number === undefined) {
      this.newToast.error("Phone number is required")
    }
    if(this.f.mobile?.value?.number !== undefined && this.f.mobile.invalid) {
      this.newToast.error("Phone number is not valid")
    }
    if(this.f.password.value === '') {
      this.newToast.error("Password is required")
    }
    if(this.f.password.value !== '' && this.f.password.invalid) {
      this.newToast.error("Password must be at least 7+ characters")
    }
    if(this.f.confirmpassword.value === '') {
      this.newToast.error("Confirm password is required")
    }
    if(this.f.confirmpassword.value !== '' && this.f.confirmpassword.invalid) {
      this.newToast.error("Confirm password not matched")
    }
  }
  open(content) {
    this.modalService.open(content, { centered: true , ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }
  navigateToSignin() {
    this.isOnSuccessRegistration = false;
    this.route.navigate(['auth/login']);
  }

  navigateToHomePage() {
    this.route.navigate(['/']);
  }
  showTemp = [];
  onfocus = false;
  emailTemplate(e) {
    this.onfocus = true;
    const [name] = e.split('@');
    if(!e.includes("@")) {
      this.showTemp = [
        name+'@msn.com',
        name+'@bigpond.com',
        name+'@westnet.com',
        name+'@icloud.com',
        name+'@live.com',
        name+'@hotmail.com',
        name+'@outlook.com',
        name+'@yahoo.com',
        name+'@gmail.com'
      ];
    }else if(e.includes("@g")) {
      this.showTemp = [
        name+'@gmail.com'
      ];
    }else if(e.includes("@y")) {
      this.showTemp = [
        name+'@yahoo.com'
      ];
    }else if(e.includes("@o")) {
      this.showTemp = [
        name+'@outlook.com'
      ];
    }else if(e.includes("@h")) {
      this.showTemp = [
        name+'@hotmail.com'
      ];
    }else if(e.includes("@l")) {
      this.showTemp = [
        name+'@live.com'
      ];
    }else if(e.includes("@w")) {
      this.showTemp = [
        name+'@westnet.com'
      ];
    }else if(e.includes("@b")) {
      this.showTemp = [
        name+'@bigpond.com'
      ];
    }else if(e.includes("@m")) {
      this.showTemp = [
        name+'@msn.com'
      ];
    }
    console.log(this.showTemp)
  }
  mailTemp(prov) {
    console.log(prov);
    this.f.email.setValue(prov);
    this.showTemp = [];
  }
  input:any;
  focusIn(e) {
    this.input = e;
  }
  focusOut() {
    setTimeout(() => {
      this.onfocus = false;
      this.input = '';
    }, 500);
  }

  getParams() {
    this.activeRoute.params.forEach(param =>
      this.inviteId = param['code']
    );
    console.log(this.inviteId)
  }
  pw_is_show = false;
  cpw_is_show = false;
  pw = 'password';
  cpw = 'password';
  show_hide_pw(e) {
    if (e === 'pw') {
      this.pw_is_show = !this.pw_is_show;
      if (this.pw_is_show) {
        this.pw = 'text';
      } else {
        this.pw = 'password';
      }
    }
    if (e === 'cpw') {
      this.cpw_is_show = !this.cpw_is_show;
      if (this.cpw_is_show) {
        this.cpw = 'text';
      } else {
        this.cpw = 'password';
      }
    }
  }
}
