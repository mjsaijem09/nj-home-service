import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import { HomeServiceService } from '../home/home-service.service';
@Component({
  selector: 'app-recent-view',
  templateUrl: './recent-view.component.html',
  styleUrls: ['./recent-view.component.scss']
})
export class RecentViewComponent implements OnInit {
  recentlyViewedList: any;
  walletBalance: any;
  isMobile: boolean = false;

  constructor(
    private homeService:HomeServiceService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();
    this.recentalyViewData()
  }

  recentalyViewData() {
    let customerToken = this.getCookie('customerToken');
    let customerDetails = localStorage.getItem('customerDetails')!;
    const obj = new HttpParams()
      .set("devicePlateform", "android")
      .set(" deviceToken", customerToken)
      this.homeService.recentlyView(obj,customerDetails).subscribe((response: any) => {
      this.recentlyViewedList = response.location;
      this.walletBalance=response.result.walletBalance;
    })
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}
