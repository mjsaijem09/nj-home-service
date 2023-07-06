import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { BookingService } from 'src/app/services/booking.service';
import { LocationService } from 'src/app/services/location.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
declare var google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('accountSetupSuccess') accountSetupSuccess;
  loginForm: UntypedFormGroup
  submitted = false;
  currentLocation: any;
  lat: any;
  getAddress: any;
  lng: any;
  isLoading : boolean = true;
  bookingData: any;
  subs: Subscription;
  registerData: any;
  accountSetup: any;
  loginURI = 'customer/login'
  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService : ApiServicesService,
    private route : Router,
    private activeRoute: ActivatedRoute,
    private locationService : LocationService,
    private authService: AuthServiceService,
    private toastService : ToasterService,
    private bookingService: BookingService,
    private location: Location,
    private modalService: NgbModal,
    private auth: AuthService
  ) {
    this.subs = this.auth.getRegisterData()
    .subscribe((details: any) => {
      this.registerData = details;
    });
    console.log(this.registerData);
    
    const loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
    console.log("cookie==>",  this.getCookie('customerLogin'))
    if (loginData) {
      this.location.back();
    }
    this.loginForm = this.formBuilder.group({
      username: [this.registerData.data.username ? this.registerData.data.username : '', [Validators.required]],
      password: [this.registerData.data.password ? this.registerData.data.password : '', [Validators.required]]
    })
    this.accountSetup = this.route.getCurrentNavigation()?.extras?.state?.accountSetup;
  }

  ngOnInit(): void {
    const url = this.route.url; // Get the current URL
    const segments = url.split('/'); // Split the URL into segments
    const lastSegment = segments[segments.length - 1]; // Get the last segment
    if(lastSegment === 'login-as-freelance') {
      this.loginURI = 'therapist/login'
    }
    this.bookingData = this.bookingService.bookingData;
    this.instanceLoader(false);
    console.log(this.bookingData.pathUrl);
    
    if(!this.bookingData.pathUrl) {
      this.bookingData.pathUrl = '/';
    }
    this.activeRoute.queryParams.subscribe(res=>{
      if (res && res.username) {
        this.loginForm.controls.username.setValue(res.username);
      }
      if (res && res.password) {
        this.loginForm.controls.password.setValue(res.password);
      }
    });
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngAfterViewInit() : void {
    this.instanceLoader(false);
    if(this.accountSetup === 'success') {
      this.openModalSetupSuccess()
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(form:any) {
    this.instanceLoader(true);
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.instanceLoader(false);
      return;
    }

    this.submitLogin(form);
  }

  submitLogin(form:any) {
    console.log(form);
    this.apiService.post_nj(this.loginURI,form.value).subscribe(
      res => {
        console.log(res);
        return;
        res.userType = this.loginURI.includes('customer') ? 'customer' : 'freelancer';
        this.instanceLoader(false);
        this.setCookie('customerLogin', JSON.stringify(res))
        this.setCookie('customerToken', res.token)
        if (this.bookingData.pathUrl) {
          console.log(this.bookingData.pathUrl)
          this.route.navigateByUrl(this.bookingData.pathUrl);
        } else {
          this.route.navigateByUrl('/')
          .then(() => {
            window.location.reload();
          });
        }
        this.apiService.setLoginData(res);
        this.getPosition();
    },err=>{
      if (err.body === "User not found") {
        this.toastService.error(err.body);
        setTimeout(() => {
          this.instanceLoader(false);
          this.route.navigate(['auth/register'],{queryParams: {username:form.value.username, password : form.value.password}});
        }, 1000);
        console.log(err);
      } else {
        this.toastService.error(err.body);
        this.instanceLoader(false);
      }
    })
  }


  getPosition()
  {
    this.getGeoLocation();
  }

  getGeoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            if (position) {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.getAddress = (this.lat, this.lng)
                console.log(position)
                    let geocoder = new google.maps.Geocoder;
                    let latlng = {
                        lat: this.lat,
                        lng: this.lng
                    };
                    geocoder.geocode({
                        'location': latlng
                    },(results:any)=> {
                        console.log(results);
                        if (results[0]) {
                            this.currentLocation = results[0];
                            localStorage.setItem('customerLocation',JSON.stringify(results[0]));
                            console.log('current location ==>>',results[0]);
                          let coordinates = {
                            'lat': this.lat,
                            'lng': this.lng,
                          }
                          this.locationService.setCurrentCoordinates(coordinates);
                            if(this.currentLocation != ''){
                                return this.currentLocation;
                            }
                            console.log(this.assgin);
                        } else {
                            console.log('Not found');
                        }
                    });
        }
      },
        (error:any) => {
          return console.log(error);
        });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
}
  assgin(assgin: any) {
    throw new Error('Method not implemented.');
  }

  // routing
  navigateToSignup() {
    console.log(this.route.navigateByUrl('auth/register'));
  }
  navigateToForgetPassword(){
    this.route.navigateByUrl('auth/forgot-password')
  }

  instanceLoader(type : boolean) {
    type ? setTimeout(() => {
      this.isLoading = type
    }, 1000) :  setTimeout(() => {
      this.isLoading = type;
    }, 1000);
  }

  navigateToHomePage() {
    this.locationService.headerTitle = '';
    this.route.navigate(['/']);
  }

  openModalSetupSuccess() {
    this.modalService.open(this.accountSetupSuccess, { centered: true });
  }
  pw_is_show = false;
  inputType = 'password';
  show_hide_pw() {
    this.pw_is_show = ! this.pw_is_show;
    if (this.pw_is_show) {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }

}
