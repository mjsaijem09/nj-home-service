import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
import { ApiServicesService } from './api-services.service';
@Injectable()
export class NotificationService {
    public currentMessage = new BehaviorSubject<any>('');
    public isRead = new BehaviorSubject<any>('');
    constructor(private angularFireMessaging: AngularFireMessaging, private service: ApiServicesService) {
        this.angularFireMessaging.messaging.subscribe(
            (_messaging) => {
                // _messaging.onMessage = _messaging.onMessage.bind(_messaging);
                _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
            }
        );
        navigator.serviceWorker.addEventListener('message', this.newMessageReceived.bind(this));
    }
    requestPermission() {
        this.angularFireMessaging.requestToken.subscribe(
            (token) => {
                this.setDeviceToken(token);
                console.log("_NEW_TOKEN: ", token);
            },
            (err) => {
                console.error('Unable to get permission to notify.', err);
            }
        );
    }
    receiveMessage() {
        this.angularFireMessaging.messages.subscribe(
            (payload) => {
                console.log("new message received. ", payload);
                this.currentMessage.next(payload);
            })
    }
    
    newMessageReceived(e) {
        if(e.data != null) {
            let type = e.data.firebaseMessagingType;
            if(type == "push-msg-received") {
                var _data = e.data.firebaseMessagingData.data
                console.log("CHECK_POINT_1", _data)
                this.currentMessage.next(_data);
                var arr = [_data];
                var notifications = JSON.parse(localStorage.getItem("notifications")!);
                if (notifications) {
                    if (notifications.length >= 1) {
                        notifications.push(_data);
                        localStorage.setItem("notifications", JSON.stringify(notifications));
                    } else {
                        localStorage.setItem("notifications", JSON.stringify(arr));
                    }
                } else {
                    localStorage.setItem("notifications", JSON.stringify(arr));
                }
            }
        }
    }
    getNotification() {
        return this.currentMessage.asObservable();
    }

    setDeviceToken(token){
        const loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
        const clientId =  loginData.client;
        const id =  loginData.result._id;
        const data = {
            "deviceInfo": {
            "devicePlateform": "web", "deviceToken": token}}
        localStorage.setItem('deviceInfo', JSON.stringify(data));
        this.service.put(`update_profile?id=${id}&clientId=${clientId}`, data).subscribe((res: any) => {
            // console.log(res);
        })
    }
    notificationIsReadChange(obj:any) {
        this.isRead.next(obj);
    }
    notificationIsRead() {
        return this.isRead.asObservable();
    }
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
}