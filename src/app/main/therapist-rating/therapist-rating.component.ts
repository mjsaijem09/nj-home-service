import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-therapist-rating',
  templateUrl: './therapist-rating.component.html',
  styleUrls: ['./therapist-rating.component.scss']
})
export class TherapistRatingComponent implements OnInit {
  therapistId: any;

  constructor(
    private activatedRoute: ActivatedRoute ,
    private router:Router,
  ) {}

  ngOnInit(): void {
    this.getTherapistId()
  }

  getTherapistId(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.activatedRoute.params
    .subscribe(params => {
      this.therapistId = params['therapistId']
    });
    if(!this.therapistId) {
      this.activatedRoute.params
        .subscribe(params => {
        const therapist = params['therapist'];
        if(therapist) {
          this.therapistId = therapist.split('-')[1];
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }
}
