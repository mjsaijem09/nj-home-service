import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-online-support-popup',
  templateUrl: './online-support-popup.component.html',
  styleUrls: ['./online-support-popup.component.scss']
})
export class OnlineSupportPopupComponent implements OnInit {

  constructor(private ngbDialogueService:NgbModal) { }

  ngOnInit(): void {
  }

  closeModel() {
    this.ngbDialogueService.dismissAll();
  }

}
