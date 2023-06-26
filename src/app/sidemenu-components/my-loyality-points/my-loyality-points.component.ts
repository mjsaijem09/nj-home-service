import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoyalitypointlistComponent } from 'src/app/shared-components/loyalitypointlist/loyalitypointlist.component';
import{MyloyalitypointService} from './myloyalitypoint.service'
@Component({
  selector: 'app-my-loyality-points',
  templateUrl: './my-loyality-points.component.html',
  styleUrls: ['./my-loyality-points.component.scss']
})
export class MyLoyalityPointsComponent implements OnInit {

  myLoyalityPointList:any=[]
  isLoading!: boolean;
  loyalityPoint: any;
  constructor( private loyalitypointservice:MyloyalitypointService, private ngbDialogueService:NgbModal, private location : Location) { }

  ngOnInit(): void {
    this.getLoyalityPoint()
  }
  getLoyalityPoint(){
    this.isLoading=true;
    this.loyalitypointservice.loyalityPoint().subscribe((response: any) => {
      console.log(response);
      
    this.myLoyalityPointList = response.result
    if(response.result && response.result[0]) {
      this.loyalityPoint=response.result[0].have
          console.log(this.loyalityPoint);
    localStorage.setItem('loyalityPoint' ,JSON.stringify(this.loyalityPoint))

    }
    
    this.isLoading=false
    }, err => { console.log(err) });
  }

  // dialogue open
  openLoyality(_id:any,have:any){
    let details = {
      id : _id,
      have :have
      }
    const openLoyalityRef=this.ngbDialogueService.open(LoyalitypointlistComponent, {centered: true});
     openLoyalityRef.componentInstance.data = details;
 }

  goBack() {
    this.location.back();
  }

}
