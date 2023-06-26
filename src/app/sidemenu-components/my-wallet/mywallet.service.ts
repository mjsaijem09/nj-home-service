import { Injectable } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Injectable({
  providedIn: 'root'
})
export class MywalletService {
  clientId=this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)

  constructor(private apiService : ApiServicesService) { }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  getWallet=()=>this.apiService.get(`transaction/findtransactions?customerId=${'5fd087a7ce34190013905ef2'}`)
}
