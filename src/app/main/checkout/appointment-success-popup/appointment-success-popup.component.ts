import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-appointment-success-popup',
  templateUrl: './appointment-success-popup.component.html',
  styleUrls: ['./appointment-success-popup.component.scss']
})
export class AppointmentSuccessPopupComponent implements OnInit {

  constructor(private ngbDialogueService:NgbModal) { }

  ngOnInit(): void {
  }

  closeModel() {
    this.ngbDialogueService.dismissAll();
  }

}
