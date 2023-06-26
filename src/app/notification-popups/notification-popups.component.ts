import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-notification-popups',
  templateUrl: './notification-popups.component.html',
  styleUrls: ['./notification-popups.component.scss']
})
export class NotificationPopupsComponent implements OnInit {

  constructor(
    private _notify: NotificationService,
    private _modal: NgbModal,
    ) { }

  ngOnInit(): void {
    this._notify.getNotification()
    .subscribe(res => {
      console.log("_data", res)
    })
  }

}
