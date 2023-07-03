import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-freelance-card',
  templateUrl: './freelance-card.component.html',
  styleUrls: ['./freelance-card.component.scss']
})
export class FreelanceCardComponent implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
  }

  defaultPicture($event, gender) {
    $event.target.src = 'assets/images/female-therapist.svg';
    if(gender === 'Female') {
      $event.target.src = 'assets/images/female-therapist.svg';
    } else if (gender === 'Male') {
      $event.target.src = 'assets/images/male-therapist.svg';
    } else {
      $event.target.src = 'assets/images/carbon_user-avatar-filled.svg';
    }
  }
}
