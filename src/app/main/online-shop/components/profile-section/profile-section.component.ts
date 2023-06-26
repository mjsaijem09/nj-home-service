import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-section',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss']
})
export class ProfileSectionComponent implements OnInit {
  @Input() shopDetails
  constructor() { }

  ngOnInit(): void {
    console.log("shopDetails: ", this.shopDetails);

  }

}
