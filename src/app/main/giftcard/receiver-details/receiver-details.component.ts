import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { GiftcardService } from '../giftcard.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-receiver-details',
  templateUrl: './receiver-details.component.html',
  styleUrls: ['./receiver-details.component.scss']
})
export class ReceiverDetailsComponent implements OnInit {
  @ViewChild("gc_value") gc_value: ElementRef;
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  selectedCountryISO = CountryISO.Australia;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  subscription: Subscription;
  card: any;
  // giftcardValue = '';
  giftCard = [
    '$25',
    '$50',
    '$75',
    '$100'
  ]
  form: UntypedFormGroup;
  submitted = false;
  isMobile: boolean;
  loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
  public env = environment.image_url+'/uploads/';
  public sender;
  option = 'send_now';
  placement = 'bottom';
  hours = [
    {hour: 1},
    {hour: 2},
    {hour: 3},
    {hour: 4},
    {hour: 5},
    {hour: 6},
    {hour: 7},
    {hour: 8},
    {hour: 9},
    {hour: 10},
    {hour: 11},
    {hour: 12}
  ];
  minutes = [
    {min: 0},
    {min: 5},
    {min: 10},
    {min: 15},
    {min: 20},
    {min: 25},
    {min: 30},
    {min: 35},
    {min: 40},
    {min: 45},
    {min: 50},
    {min: 55},
    {min: 60},
  ];
  date: NgbDateStruct;
  minDate: NgbDateStruct;
  hour = this.hours[11].hour;
  minute = this.minutes[0].min;
  meridiem = 'am';
  constructor(
    private route:Router,
    private formBuilder: UntypedFormBuilder,
    private gc: GiftcardService,
    private location: Location,
    ) {
      const current = new Date();
      this.minDate = {year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate()};
      this.date = {year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate()};

      this.form = this.formBuilder.group({
        giftCardValue: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^-?(\$[1-9][0-9]*)?$/)]],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: [''],
        phone: [''],
        email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]], 
        message: ['']
      })
    }
  get f() { return this.form.controls; }
  ngOnInit(): void {
    this.sender = this.loginData?.result?.firstName ? this.loginData?.result?.firstName : '';
    this.isMobile = this.gc.isMobileView();
    console.log('isMobile', this.isMobile);
    this.subscription = this.gc.getGiftcardDetails()
    .subscribe((details: any) => {
      this.card = details;
      console.log(this.card);
    });
    if(this.card.receiver) {
      // this.giftcardValue = this.card.card.giftcard_value;
      this.form.get('giftCardValue').setValue(this.card.card.giftcard_value);
      this.form.get('firstName').setValue(this.card.receiver.firstName);
      this.form.get('firstName').setValue(this.card.receiver.firstName);
      this.form.get('lastName').setValue(this.card.receiver.lastName ? this.card.receiver.lastName : '');
      this.form.get('phone').setValue(this.card.receiver.phone ? this.card.receiver.phone : '');
      this.form.get('email').setValue(this.card.receiver.email);
    }
    if(this.card.letter) {
      this.form.get('message').setValue(this.card.letter.message);
    }
    if(this.card && Object.keys(this.card).length === 0 && this.card.constructor === Object) {
      this.route.navigate(['/']);
    }
    this.form.controls['giftCardValue'].valueChanges.subscribe(res => {
      console.log(res);
      if(res.length == 0 || res === '') {
        this.form.get('giftCardValue').setValue('$', { emitEvent: false });
      }
      else if(res.includes('$')) {
        this.form.get('giftCardValue').setValue(res, { emitEvent: false });
      } else {
        this.form.get('giftCardValue').setValue('$'+res, { emitEvent: false });
      }
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  ngAfterViewInit() {
    // this.gc_value.nativeElement.focus();
    }
  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}

  gcValue(e?){
    console.log(e)
    this.form.get('giftCardValue').setValue(e, { emitEvent: false });
  }
  sendOption(e) {
    this.option = e;
    this.resetTime()
  }
  resetTime() {
    this.hour = this.hours[11].hour;
    this.minute = this.minutes[0].min;
    this.meridiem = 'am';
  }
  getBackgroundImage() {
    return `url('${this.env}${this.card.card.letter_bg}')`;
  }
  back() {
    this.location.back();
  }
  next() {
    this.card.letter = {
      receiver: this.form.get('firstName').value + this.form.get('lastName').value,
      phone: this.form.get('phone').value,
      email: this.form.get('email').value,
      sender: this.sender,
      message: this.form.get('message').value,
    };
    if(this.option === 'send_now') {
      this.card.deliverDate = {
        date: "Send Directly",
        time: ""
      };
    } else {
      this.card.deliverDate = {
        date: this.date,
        time: {
          hour: this.hour,
          minute: this.minute,
          meridiem: this.meridiem,
        }
      };
    }
    console.log(this.card);
    this.onSubmit();
  }
  onSubmit(){
    this.submitted = true;
    if (!this.form.valid) {
      console.log("INVALID")
    } else {
      this.card.receiver = {
        firstName: this.form.get('firstName').value,
        lastName: this.form.get('lastName').value,
        email: this.form.get('email').value,
        phone: this.form.get('phone').value,
      }
      this.card.card.giftcard_value = this.form.get('giftCardValue').value;
      this.gc.setGiftcardDetails(this.card)
      console.log("VALID");
      if(!this.isMobile) {
        this.route.navigate(['giftcard/purchase-giftcard']);
      } else {
        this.route.navigate(['giftcard/giftcard-letter']);
      }

    }
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}
