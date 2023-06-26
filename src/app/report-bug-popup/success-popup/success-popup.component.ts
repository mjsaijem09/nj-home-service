import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.scss']
})
export class SuccessPopupComponent implements OnInit {

  constructor(private ngbDialogueService:NgbModal) { }

  ngOnInit(): void {
  }
  
  closeModel() {
    this.ngbDialogueService.dismissAll();
  }

}
