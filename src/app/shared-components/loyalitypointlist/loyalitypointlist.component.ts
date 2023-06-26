import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoyalitypointlistService } from '../loyalitypointlist/loyalitypointlist.service';

@Component({
  selector: 'app-loyalitypointlist',
  templateUrl: './loyalitypointlist.component.html',
  styleUrls: ['./loyalitypointlist.component.scss']
})
export class LoyalitypointlistComponent implements OnInit, AfterViewInit {
  loyalityPointList:any=[]
  have: any;

  constructor(
    private loyalitypointservice: LoyalitypointlistService,
     private _router:Router,
     private route:ActivatedRoute,
     private ngbDialogueService:NgbModal
    ) { }
  @Input() data: any;

    
  ngOnInit(): void {
    this.have=this.data.have

  }

  ngAfterViewInit(): void {
    console.log(this.data.id, this.data.have)
    let id=this.data.id
    this.loyalitypointservice.loyalityPointList(id).subscribe((res:any) => {
      this.loyalityPointList=res.result
      console.log(res);
    },err=>{console.log(err)});
  }

  //close model
  moveLoyalityPage(){
    this.ngbDialogueService.dismissAll();
  }

}
