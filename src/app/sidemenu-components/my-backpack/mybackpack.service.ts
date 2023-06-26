import { Injectable } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Injectable({
  providedIn: 'root'
})
export class MybackpackService {
  clientId=this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)

  constructor(private apiService : ApiServicesService) { }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  myBackPack =()=>this.apiService.get(`customers/findmygiftcard?clientId=${this.clientId.client}&sent=false&received=true`)
  point=()=>this.apiService.get(`customers/loyalty_points?id=${this.clientId.client}`)
  tip=()=>this.apiService.get(`customers/findmytipcard?clientId=${this.clientId.client}`)
}
