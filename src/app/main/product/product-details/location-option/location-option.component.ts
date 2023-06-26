import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-location-option',
  templateUrl: './location-option.component.html',
  styleUrls: ['./location-option.component.scss']
})
export class LocationOptionComponent implements OnInit {
  @Input() public locationList;
  constructor(
    private location: Location,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    console.log(this.locationList);
  }
  close() {
    this.activeModal.close();
    this.location.back();
  }
  public locationId: any = null;
  selectLocation(e) {
    console.log(e.location._id);
    this.locationId = e.location._id
  }
}
