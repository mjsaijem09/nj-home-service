import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-shop-rating',
  templateUrl: './shop-rating.component.html',
  styleUrls: ['./shop-rating.component.scss']
})
export class ShopRatingComponent implements OnInit {
  locationId: any;

  constructor(
    private activatedRoute: ActivatedRoute ,
    private router:Router,
  ) {}

  ngOnInit(): void {
    this.getLocationId();
  }

  getLocationId(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.activatedRoute.params
    .subscribe(params => {
      this.locationId = params['locationId']
    });
    const location = localStorage.getItem('businessLocation') && JSON.parse(localStorage.getItem('businessLocation'));
    if(!this.locationId && location && location._id) {
      this.locationId = location._id;
    } else if (!this.locationId && !location) {
      this.router.navigate(['/']);
    }
  }
}
