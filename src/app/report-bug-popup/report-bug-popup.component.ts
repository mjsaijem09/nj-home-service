import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessPopupComponent } from './success-popup/success-popup.component';

@Component({
  selector: 'app-report-bug-popup',
  templateUrl: './report-bug-popup.component.html',
  styleUrls: ['./report-bug-popup.component.scss']
})
export class ReportBugPopupComponent implements OnInit {

  constructor(
    private router: Router,
    private ngbDialogueService:NgbModal) { }

  ngOnInit(): void {
  }

  sendBug() {
    this.ngbDialogueService.dismissAll();
    const openSuccessRef = this.ngbDialogueService.open(SuccessPopupComponent, {  centered: true  });
  }

  closeModel() {
    this.ngbDialogueService.dismissAll();
    this.router.navigate(['/']);
  }

}
