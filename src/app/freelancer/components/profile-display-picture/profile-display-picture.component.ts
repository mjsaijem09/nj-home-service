import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile-display-picture',
  templateUrl: './profile-display-picture.component.html',
  styleUrls: ['./profile-display-picture.component.scss']
})
export class ProfileDisplayPictureComponent implements OnInit {

  @Input() data;

  constructor(
    public location: Location,
  ) { }

  ngOnInit(): void {
  }
  handleIMGError($event, gender) {
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
