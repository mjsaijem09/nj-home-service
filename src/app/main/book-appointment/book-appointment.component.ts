import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss']
})
export class BookAppointmentComponent implements OnInit {
  shopName: any;
  serviceName: any;
  serviceTime: any;
  servicePrice: any;
  therapistName: any;
  timeSlot: any;
  loginData: any;
  serviceId: any;
  therapistId: any;
  locationId: any;
  loyaltyPointCanRedeem: any;
  loyaltyPointRecieve: any;
  ownerId: any;
  day: string = "";
  hour: string = "";
  appendHour: string;
  loyalityPoint: any;
  servicePricingName: any;
  durationHour: any;
  durationMin: any;
  startDate: any;
  endDate: any;
  intakeId: any;
  end: any;
  @Input() detailsPageData : any;
  @Output() bookAppointmentData : EventEmitter<any> = new EventEmitter();
  ScreenWidth: any;
  ScreenHeight: any;
  ShowMobile: any;
  constructor(private modalService: NgbModal, 
    private router : Router,
    private active:ActivatedRoute)
     {
       this.getScreenSize();

       console.log(this.locationId);
       
        //  to date format change
    let now = moment(this.startDate).format("YYYY-MM-DD ");
    let now3 = moment(this.timeSlot).format('hh:mm ');
    let now4=now3.slice()
    this.day = now;
    this.appendHour=now3+this.serviceTime
    // console.log(now2,now, end,this.appendHour,now4);
    
       
       this.loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
      }


      getScreenSize() {
        this.ScreenWidth = window.innerWidth
        this.ScreenHeight = window.innerHeight
        if (this.ScreenWidth > 1024) {
          this.ShowMobile = false
        } else if (this.ScreenWidth < 1024) {
          this.ShowMobile = true
        }
    
      }

  ngOnInit(): void {
    console.log(this.detailsPageData);
    this.active.queryParams.subscribe((params)=>{
      this.intakeId= this.detailsPageData ? this.detailsPageData.intakeId : params.intakeId
      this.durationHour= this.detailsPageData ? this.detailsPageData.durationHour : params.durationHour
      this.durationMin= this.detailsPageData ? this.detailsPageData.durationMin : params.durationMin
      this.startDate= this.detailsPageData ? this.detailsPageData.startDate : params.startDate
      this.endDate= this.detailsPageData ? this.detailsPageData.endDate : params.endDate
       this.servicePricingName= this.detailsPageData ? this.detailsPageData.servicePricingName : params.servicePricingName
       this.loyalityPoint= this.detailsPageData ? this.detailsPageData.loyalityPoint : params.loyalityPoint
      this.ownerId= this.detailsPageData ? this.detailsPageData.ownerId : params.ownerId
      this.loyaltyPointCanRedeem = this.detailsPageData ? this.detailsPageData.loyaltyPointCanRedeem : params['loyaltyPointCanRedeem'];
      this.loyaltyPointRecieve = this.detailsPageData ? this.detailsPageData.loyaltyPointRecieve : params['loyaltyPointRecieve'];
      this.shopName= this.detailsPageData ? this.detailsPageData.shopName : params.shopName,
      this. serviceName= this.detailsPageData ? this.detailsPageData.serviceName : params.serviceName,
      this. serviceTime= this.detailsPageData ? this.detailsPageData.serviceTime : params.serviceTime,
      this. servicePrice= this.detailsPageData ? this.detailsPageData.servicePrice : params.servicePrice,
      this. therapistName= this.detailsPageData ? this.detailsPageData.therapistName : params.therapistName,
      this. timeSlot= this.detailsPageData ? this.detailsPageData.timeSlot : params.timeSlot,
      this.serviceId= this.detailsPageData ? this.detailsPageData.serviceId : params.serviceId,
     this.therapistId= this.detailsPageData ? this.detailsPageData.therapistId : params.therapistId,
     this.locationId= this.detailsPageData ? this.detailsPageData.locationId : params.locationId
     });   
     let now2 = moment(this.startDate).format('hh:mm a');
     let end = moment(this.endDate).format('hh:mm a');
     this.end=end
     this.hour = now2;

 
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  openVerticallyCentered(content: any) {
    let queryData = {
      durationHour:this.durationHour,
      durationMin:this.durationMin,
      startDate:this.startDate,
      endDate:this.endDate,
      ownerId:this.ownerId,
      shopName:this.shopName,
      serviceName:this.serviceName,
      serviceTime:this.serviceTime,
      servicePrice:this.servicePrice,
      therapistName:this.therapistName,
      timeSlot:this.timeSlot,
      serviceId:this.serviceId,
      therapistId:this.therapistId,
      locationId:this.locationId,
      loyaltyPointRecieve:this.loyaltyPointRecieve,
      loyaltyPointCanRedeem:this.loyaltyPointCanRedeem,
      loyalityPoint:this.loyalityPoint,
      servicePricingName:this.servicePricingName,
      intakeId:this.intakeId
        
  }
    if(this.ShowMobile){
      this.router.navigate(['/pay'],{queryParams: queryData});;
    }if(!this.ShowMobile){
      this.bookAppointmentData.emit(queryData);
    }
    // this.modalService.open(content, { centered: true }); //different flow
  }


}
