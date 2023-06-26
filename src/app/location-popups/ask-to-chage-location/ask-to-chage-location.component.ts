import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationSelectionPopupComponent } from '../location-selection-popup/location-selection-popup.component';
@Component({
  selector: 'app-ask-to-chage-location',
  templateUrl: './ask-to-chage-location.component.html',
  styleUrls: ['./ask-to-chage-location.component.scss']
})
export class AskToChageLocationComponent implements OnInit {
  constructor(
    public activeModal: NgbActiveModal,
    private _modal: NgbModal
  ) { }

  ngOnInit(): void {
  }
  change() {
    this._modal.dismissAll();
    this._modal.open(LocationSelectionPopupComponent,{centered: true})
  }
}
