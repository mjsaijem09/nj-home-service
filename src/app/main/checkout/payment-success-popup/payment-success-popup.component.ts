import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-success-popup',
  templateUrl: './payment-success-popup.component.html',
  styleUrls: ['./payment-success-popup.component.scss']
})
export class PaymentSuccessPopupComponent implements OnInit {
  @Input() public value;
  service: any;
  amount: any;
  constructor(private ngbDialogueService:NgbModal) { }

  ngOnInit(): void {
    console.log("value", this.value);
    this.service = this.value?.serviceName + " - " + this.value?.duration;
    this.amount = this.value?.amount;
  }

  closeModel() {
    this.ngbDialogueService.dismissAll();
  }

}
