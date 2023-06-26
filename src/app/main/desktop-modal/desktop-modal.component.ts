import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-desktop-modal',
  templateUrl: './desktop-modal.component.html',
  styleUrls: ['./desktop-modal.component.scss']
})
export class DesktopModalComponent implements OnInit {

  @Input() public user : any;
  bookForData: any;
  sendRequestData: any;
  intakeFormData: any;
  detailsPageData: any;

  constructor(
    private ngbModal : NgbModal,
    private router : Router
  ) { }

  ngOnInit(): void {
    console.log(this.user);
  }

  selectTimeChanged(e : any) {
    console.log(e);
    if(e.request) {
      this.sendRequestData = e;
    } else {
      this.bookForData = e;
    }
    
    
  } 

  bookForContent(e: any) {
    console.log(e);
    this.intakeFormData = e;
  }

  intakeDataSelected(e:any) {
    console.log(e);
    this.detailsPageData = e;
  }

  bookAppointmentData(e : any) {
    console.log(e);
    this.ngbModal.dismissAll();
    this.router.navigate(['/pay'],{queryParams: e});
  }

  onrequestData(e: any){
    this.ngbModal.dismissAll();
  }
}
