import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  clientId: any;
  customerId: any;
  profileData: any;
  isLoading: boolean = false;
  profileForm: any;
  submitted: boolean = false;
  selectedGender: string = '';

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  maxDate
  constructor(private formBuilder: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private NgbDialogService: NgbModal,
    private apiService: ApiServicesService,
    private newToast: ToasterService

  ) {
    const customerDetails = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
    this.clientId = customerDetails?.client;
    this.customerId = customerDetails?.result?._id;
    this.buildForm({});
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  ngOnInit(): void {
    this.getMyProfile();
    const d = new Date();
    let year = d.getFullYear()-16;
    let month = 12
    let day = 31;
    this.maxDate = {year, month, day};
  }

  buildForm(data: any) {
    let dob, mobile;
    if(data.dob) {
      const date = new Date(data.dob);
      dob = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }
    }
    if(data.mobile) {
      mobile = { number: data.mobile, countryCode: data.countryStr && data.countryStr.toUpperCase(), dialCode: data.countryCode };
    }
    this.profileForm = this.formBuilder.group({
      firstName: [data.firstName || '', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z][a-zA-Z\\s]+$')])],
      lastName: [data.lastName || '', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z][a-zA-Z\\s]+$')])],
      dob: [dob || '', Validators.required],
      // gender: [this.selectedGender || '', Validators.required],
      country: [data.address && data.address.country || '', Validators.required],
      mobile: [mobile || ''],   
      email: [data.email || ''],   
      // password: [''],   
      area: [data.address && data.address.area || ''],   
      street: [data.address && data.address.street || ''],  
      city: [data.address && data.address.city || ''],
      state: [data.address && data.address.state || ''],
      zip: [data.address && data.address.zip || '']
    });
  }
  navigateBack() {
    this.router.navigate(['/'],{queryParams: {title: 'profile'}});
  }

  goToChangePassword() {
    this.router.navigate(['auth/change-password']);
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    } else {
    console.log(this.profileForm.value);
      const { firstName, lastName, mobile, dob, country, area, street, city, state, zip } = this.profileForm.value;
      if(mobile && mobile?.number && !this.profileForm.controls.mobile.valid) {
        this.newToast.error("Mobile number is not valid")
      }
      if(!this.profileForm.controls.email.valid) {
        this.newToast.error("Email is not valid")
      }
      const data = {
        firstName,
        lastName,
        gender: this.selectedGender,
        mobile: mobile?.number,
        countryCode: mobile?.dialCode,
        countryStr: mobile?.countryCode ? (mobile?.countryCode).toLowerCase() : null,
        dob: dob ? dob.year + '/' + dob.month + '/' + dob.day : null,
        // password,
        address: {
          area,
          street,
          city,
          state,
          country,
          zip
        }
      }
      this.apiService.put(`update_profile?id=${this.customerId}&clientId=${this.clientId}`,data).subscribe((res:any)=>{
        this.newToast.success(res.message)
        let customerDetails = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
        customerDetails.result = res.result;
        this.setCookie('customerLogin',JSON.stringify(customerDetails));
        this.apiService.setLoginData(customerDetails);
        this.router.navigate(['/']);
      },(err)=>{
        console.log(err)
        // this.newToast.success(err.message)
      })
    }
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

  getMyProfile(){
    this.isLoading = true;
    this.apiService.get(`get_profile/${this.customerId}`).subscribe((res:any) => {
      this.profileData = res.result;
      this.selectedGender = this.profileData.gender
      this.buildForm(this.profileData);
      this.isLoading = false;
    }, err => {
      console.log(err);
      this.isLoading = false;
    });
  }

  getBackgound(badgeScore: any) {
    if (badgeScore < 25) {
      return "url('../../../../assets/images/score/surface4.png')";
    } else if (badgeScore >= 25 && badgeScore < 50) {
      return "url('../../../../assets/images/score/surface3.png')";
    } else if (badgeScore >= 50 && badgeScore < 75) {
      return "url('../../../../assets/images/score/surface2.png')";
    } else if (badgeScore >= 75) {
      return "url('../../../../assets/images/score/surface1.png')";
    }
  }

  openPickImage(content: any) {
    this.NgbDialogService.open(content, { centered: true });
    }

  openSetImage() {
    this.router.navigate(['/my-profile/photo']);
  }

  openCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then( (stream) => {
        this.router.navigate(['/my-profile/photo'], { queryParams: { camera: 'user' } });
      })
        .catch( (err) => {
          console.log(err.name + ": " + err.message);
          this.newToast.error("Camera : " + err.message)
        });
    }
    
  }
  

}
