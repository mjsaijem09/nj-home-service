import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ViewPortService } from 'src/app/services/view-port.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notificationList: any = [];
  appointmnet: any = [];
  isLoading!: boolean;
  moment = moment
  user = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
  smallDevice: boolean;
  constructor(
    private apiService: ApiServicesService,
    public router: Router,
    private cdref: ChangeDetectorRef,
    private notification: NotificationService,
    private viewPort: ViewPortService
  ) {
    this.smallDevice = viewPort.smallDevice();
  }



  ngOnInit() {
    this.isLoading=false;
    this.notificationLists();
  }

  notificationLists() {
    this.apiService.get(`notification_list/customer/${this.user.result._id}`)
      .subscribe((res) => {
        this.notificationList = res.result;
        this.isLoading= false;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  setDefaultShopImage(e: any) {
    e.target.src = './assets/images/no_image.png';
  }
  navigateTo(status: any) {
    var statusValue = JSON.parse(status)
    switch (statusValue) {
      case 1:
        this.router.navigate(['nav/my-backpack']);
        break;
      case 2:
        this.router.navigateByUrl(''); // add review
        break;
      case 3:
        this.router.navigate(['nav/my-score']);
        break;
      case 4:
        this.router.navigate(['/schedule']);
        break;
      case 5:
        this.router.navigate(['/schedule']);
        break;
      case 6:
        this.router.navigate(['nav/my-backpack']);
        break;
      case 7:
        this.router.navigateByUrl(''); // confusion hai but therapist app me bhejna hai
        break;
      case 8:
        this.router.navigate(['/schedule']);
        break;
      case 9:
        this.router.navigateByUrl('');// add review modal 
        break;
      case 10:
        this.router.navigateByUrl('');// add review modal
        break;
      case 11:
        this.router.navigate(['nav/my-points']);
        break;
      case 12:
        this.router.navigateByUrl('');// page need to designe for palm levelup
        break;
    }
  }
  confirmNotif(data) {
    let body = {
      read: !data.read
      }
    this.apiService.put(`update_notification/${data._id}`, body)
    .subscribe(res => {
      this.notificationLists();
      this.notification.notificationIsReadChange(data)
    })
  }
}
