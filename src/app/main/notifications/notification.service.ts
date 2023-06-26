import { Injectable } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { SwPush } from "@angular/service-worker";
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class NotificatinService {

  user = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)

  sub: PushSubscription;

  readonly VAPID_PUBLIC_KEY = "BF5CV16Dz5rWlt1ihENsBhahDSpl-xz-wdNRbXkiC9-ASq7_iuodaAMCJBaXaJN0ttruRpODQQwn2LX10caojjU";

  constructor(
    private apiService : ApiServicesService,
    private swPush: SwPush
  ) { }

  // notification = () => this.apiService.get('notify/customer');
  appointment(){
    return this.apiService.get(`appointments/group/${this.user.result._id}`)
    .pipe(
      map(res => res.lessons)
    )
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  // appointment = () => this.apiService.get(`appointments/group/${this.user.result._id}`);
  subscribeToNotifications() {

    this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => {

        this.sub = sub;


        console.log("Notification Subscription: ", sub);

        return this.apiService.post('/api/notifications', sub).subscribe(
            () => console.log('Sent push subscription object to server.'),
            err =>  console.log('Could not send subscription object to server, reason: ', err)
        );

    })
    .catch(err => console.error("Could not subscribe to notifications", err));
  }
}
