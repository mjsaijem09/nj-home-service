import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { MyrelationshipsService } from './myrelationships.service'

@Component({
  selector: 'app-my-relationships',
  templateUrl: './my-relationships.component.html',
  styleUrls: ['./my-relationships.component.scss']
})
export class MyRelationshipsComponent implements OnInit {
  clientId=this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)

  myRelationShipList: any = []
  isLoading!:boolean
  constructor(
    private myrelationshipsservice: MyrelationshipsService,
    private router:Router,
    private service:ApiServicesService,
    private newToast:ToasterService
    
    ) { }

  ngOnInit(): void {
    this.myRelationship();
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  myRelationship() {
    this.isLoading=true;
    this.myrelationshipsservice.getMyRelationships().subscribe((response: any) => {
    this.myRelationShipList = response.ClientRelations
    this.isLoading=false;
    }, err => { console.log(err) });
  }

  // api for delete relationship
  deleteRelation(relationshipitem:any){
    let data={

    }
    this.service.put(`customers/deleteRelations?relation=${relationshipitem?._id}&id=${this.clientId.client}`, data).subscribe((res)=>{
      console.log(res);
      if(res.status==200){
        this.newToast.success("Deleted succesfully");
        this.myRelationship();
      }
      
    },(err)=>{
      this.newToast.error("something went wrong")
    })

  }

  // routing
  goToSendGift(relationshipitem:any){
    this.router.navigate(['nav/send-gift'],{queryParams:{
      firstName:relationshipitem?.firstName,
      lastName:relationshipitem?.lastName,
      email:relationshipitem?.email,
      relation:relationshipitem?.relationship,
      mobile:relationshipitem?.phone1,
      giftCardId:relationshipitem?._id


    }})
  }
}
