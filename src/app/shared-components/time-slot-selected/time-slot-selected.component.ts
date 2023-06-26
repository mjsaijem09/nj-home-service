import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-time-slot-selected',
  templateUrl: './time-slot-selected.component.html',
  styleUrls: ['./time-slot-selected.component.scss']
})
export class TimeSlotSelectedComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

    closePopup() {
        this.activeModal.dismiss('success');
      }

}
