import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-my-request',
  templateUrl: './my-request.component.html',
  styleUrls: ['./my-request.component.scss'],
})
export class MyRequestComponent implements OnInit {
  requestedData: any;

  constructor(private apiService: ApiServicesService) {}

  ngOnInit(): void {
    let clientDetails = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
    let clientId = clientDetails.client;
    this.getAllrequestedAppointment(clientId);
  }
  getAllrequestedAppointment(id: any) {
    this.apiService
      .get(`customers/myrequest?id=${id}`)
      .subscribe((res: any) => {
        this.requestedData = res.request;
        console.log(res);
      });
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  cancelRequest(data:any){
    console.log(data) 
    let body = {
      requestId:data._id,
      status:'cancel'
    }
    console.log(body)
     this.apiService.put(`customers/updateRequest`,body).subscribe((res:any)=>{
       console.log(res)
       this.ngOnInit()
     })
  }
}
