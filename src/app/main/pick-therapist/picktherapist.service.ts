import { Injectable } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Injectable({
  providedIn: 'root'
})
export class PickTherapistService {

  constructor(private apiService : ApiServicesService) { }

  getAvailableTherapists = (locationId: any, ownerId: any, date: any) =>{
    return this.apiService.get(`available_staff?view=day&date=${date}&location_id=${locationId}&owner=${ownerId}`)
  }
  therapists = (locationId: any, ownerId: any, serviceId: any) =>{
    return this.apiService.get(`get_therapist?location_id=${locationId}&shop_owner=${ownerId}&service=${serviceId}`)
  }
}
