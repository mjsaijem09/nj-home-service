import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
 customerId: any;
 customerDetail: any;
 isMobile: any;
 userData: any;
 isLoading = false;
  constructor(private activatedRoute: ActivatedRoute ,
    private httpService: ApiServicesService,
    private authService:AuthServiceService,
    private bookingService: BookingService,
    private router:Router) { }

  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();
    this.userData = this.authService.getUserData();
    this.activatedRoute.params
    .subscribe(params => {
      this.customerId=params['id']
    });
     
     this.getCustomer()
  }

  getCustomer() {
       this.isLoading = true;
       this.httpService.get(`get_customer_detail?customerId=${this.customerId}`).subscribe(res=>{
           this.customerDetail = res.result;
            this.isLoading = false;
       })
  }

   setDefaultTherapistPic(e: any, gender: string) {
    if(gender === 'Male') {
      e.target.src = './assets/images/male-user.svg';
    } else {
      e.target.src = './assets/images/female-user.svg';
    }
  }

  getBackgound(badgeScore:any){
    if(badgeScore < 25){
      return "url('../../../../assets/images/score/surface4.png')";
    }else if(badgeScore >= 25 && badgeScore < 50){
      return "url('../../../../assets/images/score/surface3.png')";
    }else if(badgeScore >= 50 && badgeScore < 75){
      return "url('../../../../assets/images/score/surface2.png')";
    }else if(badgeScore >= 75){
      return "url('../../../../assets/images/score/surface1.png')";
    }
  }

}