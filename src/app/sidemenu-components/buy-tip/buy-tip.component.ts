import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-buy-tip',
  templateUrl: './buy-tip.component.html',
  styleUrls: ['./buy-tip.component.scss']
})
export class BuyTipComponent implements OnInit {
  tipImage: any;
  amount: any;
  title: any;
  clientId=this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
  tipList: any=[];

  constructor(private service:ApiServicesService, private router:Router,
    private active:ActivatedRoute) 
    {
      this.active.queryParams.subscribe((params)=>{
        this.tipImage=params.tipImage,
        this.amount=params.amount,
        this.title=params.title

      })
     }

  ngOnInit(): void {
    this.tipData()
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // api for tipList
  tipData(){
    this.service.get(`customers/findmytipcard?clientId=${this.clientId.client}`).subscribe((res)=>{
      console.log(res);
      if(res.status==200){
        this.tipList = res.result
      }
      console.log(this.tipList);
      
    })
  }

  buyTip(tipItem:any){
    this.router.navigate(['/nav/tip-payment'],{queryParams:{
      amount:tipItem?.tipCardId.amount
    }})
  }

}
