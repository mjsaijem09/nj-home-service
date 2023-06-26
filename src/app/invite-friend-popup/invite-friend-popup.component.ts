import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invite-friend-popup',
  templateUrl: './invite-friend-popup.component.html',
  styleUrls: ['./invite-friend-popup.component.scss']
})
export class InviteFriendPopupComponent implements OnInit {

  constructor(private ngbDialogueService:NgbModal) { }

  ngOnInit(): void {
  }

  closeModel() {
    this.ngbDialogueService.dismissAll();
  }

}
