import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-money-popup',
  templateUrl: './add-money-popup.component.html',
  styleUrls: ['./add-money-popup.component.scss']
})
export class AddMoneyPopupComponent implements OnInit {

  walletList:any={}
  isLoading!: boolean;
  constructor( private location : Location, private NgbModal:NgbModal) { }

  ngOnInit(): void {
  }
  
    navigateBack() {
    this.NgbModal.dismissAll();
    }
}
