import { Component, OnInit } from '@angular/core';

import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  constructor(private _http: ApiServicesService) { }
  formSubmitted = false;
  loader:boolean = false;
  payload = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    address: '',
    gender: '',
    profileImage: '',
    password: '',
    confirmPassword: '',
    category: [],
    geo_location: {
      lat: null,
      long: null,
    },
    availableLocation:[]
  }

  ngOnInit(): void {
    
  }
  heading = {
    step: 0,
    title: 'Get Started with Freelancing!',
    subtitle: 'Discover the freedom to offer your diverse &#10; range of therapeutic services.'
  }
  disableCategory:boolean = true;
  categoryOutput($event) {
    this.payload.category = [];
    // result from category-list component
    console.log($event);

    // Check if all objects have selected set to false
    const allSelectedFalse = $event.every(item => item.selected === false);
    console.log(allSelectedFalse); // Output
    this.disableCategory = allSelectedFalse;
    $event.forEach(element => {
      if(element.selected) {
        this.payload.category.push(element.id);
      }
    });
    console.log(this.payload.category);
  }

  disableForm:boolean = true;
  fromChange($event) {
    console.log($event);
  }

  proceedTo(step) {
    console.log(step);
    switch (step) {
      case 0:
        this.heading.step = step;
        this.heading.title = 'Get Started with Freelancing!';
        this.heading.subtitle = 'Discover the freedom to offer your diverse &#10; range of therapeutic services.';
        break;
      case 1:
        this.heading.step = step;
        this.heading.title = 'Select Category';
        this.heading.subtitle = 'Select the type of service you offer';
        break;
      case 2:
        this.heading.step = step;
        this.heading.title = 'Personal Information';
        this.heading.subtitle = 'Fill the required information';
        break;
      case 3:
        this.formSubmitted = true;
        let validArr = [
          this.isValidName(this.payload.firstName),
          this.isValidPhone(this.payload.phone),
          this.isValidPassword(this.payload.password),
          this.isConfirmedPasswordMatch(this.payload.password, this.payload.confirmPassword),
        ];
        const validRequirements = validArr.every(item => item === true);
        if(validRequirements) {
          if (this.payload.dob) {
            this.payload.dob = new Date(this.payload.dob).toISOString();
          }
          console.log("payload: ",this.payload);
          this.register();
        }
        break;
      case 4:
        this.heading.step = step;
        this.heading.title = 'Setup Location';
        this.heading.subtitle = 'Setting up your location will help us lead your client';
        break;
      default:
        break;
    }
  }
  registeredData
  register() {
    this._http.post_nj(`therapist/registration`, this.payload)
    .subscribe(res => {
      console.log(res);
      this.registeredData = res.result;
      localStorage.setItem('registeredData', JSON.stringify(this.registeredData));
      this.heading.step = 3;
      this.heading.title = 'Setup Location';
      this.heading.subtitle = 'Setting up your location will help us lead your client';
    })
  }

  // validations
  isValidName(name: string): boolean {
    const pattern = /^(?=.*[aeiouAEIOU])[A-Za-z\s]{2,}$/;
    return pattern.test(name);
  }

  isValidPhone(phone: string): boolean {
    const pattern = /^9[1-9]\d{8}$/;
    return pattern.test(phone);
  }

  isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  isConfirmedPasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  getCoordinates($event) {
    console.log($event)
    this.payload.geo_location = $event;
  }
}
