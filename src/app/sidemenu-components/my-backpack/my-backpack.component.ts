import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoyalitypointlistComponent } from 'src/app/shared-components/loyalitypointlist/loyalitypointlist.component';
import { MybackpackService } from './mybackpack.service'

@Component({
  selector: 'app-my-backpack',
  templateUrl: './my-backpack.component.html',
  styleUrls: ['./my-backpack.component.scss']
})
export class MyBackpackComponent implements OnInit {
  
  isContentType: any = 'giftcard';
  myBackPackList: any = [];
  pointList: any = [];
  tipList: any = [];
  isLoading!: boolean
  currTab = 'giftcard'
  constructor(private mybackpackservice: MybackpackService,
    private route:Router,
    private ngbDialogueService:NgbModal) { }

  ngOnInit(): void {
    this.getMyBackPack()
  }

  getMyBackPack() {
    this.isLoading = true
    this.mybackpackservice.myBackPack().subscribe((response: any) => {
      this.myBackPackList = response.result
      this.isLoading = false
    }, err => { console.log(err) });
  }
  getPoint() {
    this.isLoading = true
    this.mybackpackservice.point().subscribe((response: any) => {
      this.pointList = response.result
      console.log(this.pointList);
      
      this.isLoading = false
    }, err => { console.log(err) });
  }
  getTip() {
    this.isLoading = true
    this.mybackpackservice.tip().subscribe((response: any) => {
      this.tipList = response.result
      this.isLoading = false
    }, err => { console.log(err) });
  }
  // for tab link
  showContent(type: any) {
    this.currTab = type;
    if (this.currTab == 'giftcard') {
    }
    if (this.currTab == 'tipcard') {
      this.getTip()
    }
    if (this.currTab == 'point') {
        this.getPoint()
    }
  }

  // routing
  sendTip(tipItem:any){
    this.route.navigate(['/nav/send-tip'],{queryParams:{
      tipCardId:tipItem?.tipCardId._id,
      tipImage:tipItem?.tipCardId.tipImage,
      amount:tipItem?.amount,
      day:tipItem?.date,
      _id:tipItem?._id
    }})
  }
  goToBuy(tipItem:any){
    console.log(tipItem);
    
    this.route.navigate(['/nav/tip-payment'],{queryParams:{
      amount:tipItem?.tipCardId.amount,
      tipCard:tipItem?.tipCardId._id,
    }})
  }

  
  goToLoyalityPoint(_id:any,have:any){
    console.log(_id);
    let details = {
      id : _id,
      have :have
      }
    
    const openLoyalityRef=this.ngbDialogueService.open(LoyalitypointlistComponent, );
     openLoyalityRef.componentInstance.data = details;
 }
}


