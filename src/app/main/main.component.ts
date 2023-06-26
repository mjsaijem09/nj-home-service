import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ApiServicesService } from '../services/api-services.service';
import { NotificationService } from '../services/notification.service';
import { UpdateService } from '../services/update.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild('wrongLocation') wrongLocation: ElementRef<HTMLElement> | any;
  title = 'customer-pwa';
  url: any;
  message: any;
  VAPID_PUBLIC_KEY = environment.webPush?.publicKey;
  customerDetails: any;
  eventPage: boolean = false;
  isHomeComplete: boolean = false;
  is_not_shop_subdomain: boolean = true;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private notificationService: NotificationService,
    private apiService: ApiServicesService,
    private sw: UpdateService,
    private _ui : UiService
  ) {
    // check the service worker for updates
    this.sw.checkForUpdates();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.url = e.url;
        console.log(this.url)
        if(this.url != '/' && !this.url?.includes('/shop')) {
          this.isHomeComplete = true;
        }
        if(this.url?.includes('event')) {
          this.eventPage = true;
        } else {
          this.eventPage = false;
        }
      }
    });
  }
  domainURL = '';
  ngOnInit() {
    this.customerDetails = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
    if (this.customerDetails) {
      this.notificationService.requestPermission();
      this.notificationService.receiveMessage();
    }
    let baseurl = window.location.href;//'https://cityescape.thebookus.com/'
    console.log("Base URL", baseurl);
    this.domainURL = /:\/\/([^\/]+)/.exec(baseurl)[1];
    console.log("domain URL", this.domainURL);
    let sub_domain = this.domainURL.split('.')[0];
    console.log("sub_domain", sub_domain);
    if (sub_domain != 'home' && !sub_domain.includes('localhost')) {
      let businessLocation = localStorage.getItem('businessLocation');
      if (!businessLocation) {
        this.getBusinessDetails(sub_domain);
      }
      this.is_not_shop_subdomain = false;
    } else {
      localStorage.removeItem('businessLocation');
    }
    this.checkIfLoadingCompleted();
  }
  checkIfLoadingCompleted() {
    this._ui.isHomeComplete().subscribe(
      res => {
        console.log('isHomeComplete', res.isHomeComplete);
        this.isHomeComplete = res.isHomeComplete;
      }
    );
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  getBusinessDetails(sub_domain) {
    this.apiService.get(`business_details?website_address=${sub_domain}`).subscribe(
      (res) => {
        localStorage.setItem('businessLocation', JSON.stringify(res.result));
        this.router.navigate([this.domainURL])
        .then(() => {
          window.location.reload();
        });
      },
      (err) => {
        localStorage.removeItem('businessLocation');
        if (err.status === 400) {
          this.modalService.open(this.wrongLocation, {
            centered: true,
            backdrop: 'static',
            keyboard: false,
          });
        } else {
        }
      }
    );
  };
  activeSlides: SlidesOutputData;
  slideEvent(data: SlidesOutputData) {
    this.activeSlides = data;
    console.log(this.activeSlides);
  }

}
