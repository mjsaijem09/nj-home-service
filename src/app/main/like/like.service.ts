import { Injectable } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  clientId = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)?.client;

  constructor(private apiService : ApiServicesService) { 
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  favouriteShops = () => this.apiService.get(`get_favorite_shops?clientId=${this.clientId}`)
  favouriteTherapists = () => this.apiService.get(`get_favorite_therapists?clientId=${this.clientId}`)
  delFevTherapist = (id:any)=>this.apiService.delete(`therapist/${id}`)
  delFevShop =(id:any)=>this.apiService.delete(`shop/${id}`)
}
