import { Injectable } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HomeServiceService {

  private commentData = new BehaviorSubject('default message');
  getCommentData = this.commentData.asObservable();

  // clientId=JSON.parse(localStorage.getItem('customerLogin')!)
  constructor(private apiService : ApiServicesService) { }

 categories = () => this.apiService.get('category');

 recentlyView(data:any, obj:any){
   return this.apiService.put(`customers?id=${obj.result._id}&clientId=${obj.client}`,data)
 }

 pickTherapist = (locationId:any,ownerId:any,serviceId:any) =>{
  // console.log(locationId, serviceId,ownerId)
  return this.apiService.get(`pwa/get_therapist_list?shop_owner=${ownerId}&location_id=${locationId}&service=${serviceId}&app=true`)
}

sendCommentData(message: any) {
  this.commentData.next(message)
}

}
