import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMoneyPopupComponent } from './add-money-popup/add-money-popup.component';
import {MywalletService} from './mywallet.service'
@Component({
  selector: 'app-my-wallet',
  templateUrl: './my-wallet.component.html',
  styleUrls: ['./my-wallet.component.scss']
})
export class MyWalletComponent implements OnInit {

  walletList:any={}
  isLoading!: boolean;
  constructor(private walletservice:MywalletService, private location : Location, private ngbDialogueService:NgbModal) { }

  ngOnInit(): void {
    this.getWalletData()
  }

  getWalletData(){
    this.isLoading=true;
   this.walletservice.getWallet().subscribe((response:any)=>{
     this.walletList = response
     this.isLoading=false;
    },err=>{console.log(err)});
  }

   goBack() {
    this.location.back();
  }

  openAddMoney(){
    let details = {
      }
    const openAddMoneyyRef=this.ngbDialogueService.open(AddMoneyPopupComponent, { centered: true, size: 'sm' });
    openAddMoneyyRef.componentInstance.data = details;
 }


}
