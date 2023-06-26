import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-loyalty-points-received',
  templateUrl: './loyalty-points-received.component.html',
  styleUrls: ['./loyalty-points-received.component.scss']
})
export class LoyaltyPointsReceivedComponent implements OnInit {
  @Input() public data;

  constructor(
    private modal:NgbModal,
    public activeModal: NgbActiveModal,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    console.log("CHECK_POINT_3", this.data)
  }
  closeModel() {
    this.modal.dismissAll();
  }
  navigate() {
    this._route.navigate([`shop/${this.data.locationId}`]);
    this.modal.dismissAll();
  }
}
