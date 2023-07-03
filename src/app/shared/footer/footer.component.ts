import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
// 
import { NotificationService } from 'src/app/services/notification.service';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isHomeFooter: boolean = false;
  presentUrl: any;
  ShowMobile: boolean;
  loading = true;
  notifCount: any;
  user = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);

  constructor(
    private route: Router,
    private notification: NotificationService,
    private http: ApiServicesService,
  ) {
    setInterval(() => {
      this.getScreenSize();
    }, 100);
   }
   getScreenSize(){
    let ScreenWidth = window.innerWidth
    if (ScreenWidth <= 1024){
     this.ShowMobile = true;
    } else {
      this.ShowMobile = false;
    }
    this.loading = false;
    if(this.route.url.includes('shop')){
      if (this.ShowMobile) {
        this.isHomeFooter = false;
      } else {
        this.isHomeFooter = true;
      }
    }
  }

  ngOnInit(): void {
    if(this.route.url == '/') {
      this.isHomeFooter = true;
    }
    this.route.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(res => {
      console.log(res);
      this.getRoute();
    })
    this.getRoute();
    this.notification.getNotification()
    .subscribe(res => {
      this.hasNotif()
    })
    this.notification.notificationIsRead()
    .subscribe(res => {
      this.hasNotif()
    })
  }
  getRoute() {
    this.route.url.split('/').length == 1 ? this.presentUrl = this.route.url.split('/')[2] : this.presentUrl = this.route.url ;
    // console.log(this.presentUrl);
    if(this.route.url.includes('auth')){
      this.isHomeFooter = false;
    }else  if(this.route.url.includes('online-support')) {
      this.isHomeFooter = false;
    }else  if(this.route.url.includes('report-bug')) {
      this.isHomeFooter = false;
    }else  if(this.route.url.includes('my-backpack')) {
      this.isHomeFooter = false;
    }else if(this.route.url.includes('wallet') || this.route.url.includes('credit-card') || this.route.url.includes('review')){
      this.isHomeFooter = true;   
    }else {
        if(this.route.url.includes('invite-friend')) {
          this.isHomeFooter = true;
        }
        const location = localStorage.getItem('businessLocation') && JSON.parse(localStorage.getItem('businessLocation'))._id;
        console.log("this.route.url", this.route.url);
        console.log("!location", !location);
        if((this.route.url == '/' && !location) || this.route.url == '/schedule' || this.route.url == '/like' || this.route.url == '/notifications' || this.route.url == '/my-profile' || this.route.url == '/nav/scanner') {
          this.isHomeFooter = true;
        }
        if(this.route.url.includes('product/cart')){
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('my-purchases')){
          this.isHomeFooter = true;
        }
        if(this.route.url.includes('search') || this.route.url.includes('category') || this.route.url ==( '/my-giftcards')){
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('therapist')){
          this.isHomeFooter = false;
          if (!this.ShowMobile) {
            this.isHomeFooter = true;
          }
        }
        if(this.route.url.includes('shop-details')){
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('shop-detail')){
          this.isHomeFooter = true;
        }
        if(this.route.url.includes('select-service')){
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('checkout')){
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('confirm-booking')){
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('pick-therapist')){
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('select-time')){
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('service')){
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('send-request')){
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('book-for')){
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('book-for')){
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('book-appointment')) {
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('intake-form')) {
          this.isHomeFooter = false;
        }
        if(this.route.url.includes('recent')) {
          if (!this.ShowMobile) {
            this.isHomeFooter = true;
          }else{
            this.isHomeFooter = false;
          }
        }
        if(this.route.url.includes('freelance')) {
          this.isHomeFooter = false;
        }
      // }else{
      //   this.isHomeFooter = true;
      // }
    }
  }
  hasNotif() {
    if(this.user?.result._id) {
      this.http.get(`notification_list/customer/${this.user.result._id}`)
        .subscribe((res) => {
          let readTrueList = res.result.filter( i => [false].includes( i.read ));
          this.notifCount = readTrueList.length;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  navigate(url:string) {
    this.presentUrl = url;
    this.route.navigateByUrl(url);
    if (url==='/notifications') {
      localStorage.removeItem("notifications");
      this.hasNotif();
    }
  }
  
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}
