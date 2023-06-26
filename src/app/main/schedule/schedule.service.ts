import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  user = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
  
  constructor(private apiService : ApiServicesService) {}

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  cancelAppointment = (bookingReference: any) =>  {
    // Trigger cancellation notification
    console.log(this.user);
    let cancellationBody = {
      booking_reference: bookingReference
    }
    this.apiService.post('client_notifications/cancellationNotification', cancellationBody);

    return this.apiService.delete(`cancel_appointment?clientId=${this.user.client}&booking_reference=${bookingReference}`);

  }
  schedule = () => this.apiService.get(`appointments/group/${this.user.result._id}`);
  search_company = (query: any) => this.apiService.get(`customers/search_company?`+query);
}
