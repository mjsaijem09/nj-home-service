import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-level',
  templateUrl: './customer-level.component.html',
  styleUrls: ['./customer-level.component.scss']
})
export class CustomerLevelComponent implements OnInit {
  loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
  displayblock1 = false;
  displayblock2 = false;
  displayblock3 = false;
  displayblock4 = false;
  displayblock5 = false;
  constructor() { }

  ngOnInit(): void {
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

}
