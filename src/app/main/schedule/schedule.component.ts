import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ScheduleService } from './schedule.service'
import * as moment from 'moment'
import { BookingService } from 'src/app/services/booking.service';
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  modalForm!: UntypedFormGroup
  isContentType: boolean = true;
  upcomingList: any = []
  historyList: any = []
  currTab: any = 'upcoming'
  isLoading!: boolean;
  rateing = 3.6;
  isMobile: boolean = false;
  historyDetails: boolean = false;
  serviceName: any;
  historydata: any = {};
  upcomingdata: any = {};
  upcomingDetails: boolean = false;
  location: any;
  policy: boolean = false;
  appointmentsHistory: any[] = [];
  appointmentsUpcoming: any[] = [];

  moment: any = moment;
  selectedAppointment: any;
  cancelAndEditRestrictionTime: any;
  public PerthTimeZone: string = 'GMT+8';

  constructor(private scheduleservice: ScheduleService,
    private cdref: ChangeDetectorRef, private _route: Router,
    private httpService: ApiServicesService,
    private newToast: ToasterService,
    private modalService: NgbModal,
    private service: ApiServicesService,
    private bookingService: BookingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.modalForm = new UntypedFormGroup({
      editPolicy: new UntypedFormControl('', Validators.required),
      freePolicy: new UntypedFormControl('', Validators.required),
      penalityPolicy: new UntypedFormControl('', Validators.required)
    })
    if (window.innerWidth > 1024) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
    this.getAppointmentListing();
  }

  getData() {
    // this.isLoading=true;
    this.scheduleservice.schedule().subscribe((res: any) => {
      console.log(res)
      this.upcomingList = res.result.upcoming;
      this.historyList = res.result.past;
      // this.isLoading=false
    }, err => { console.log(err) });
    this.cdref.detectChanges()
  }

  showContent(type: any) {
    this.currTab = type;
  }

  // api for sent invoice to email customers/send_invoice?invoice=RXBZ66NK
  sendInvoice(data) {
    console.log(data);
    this.httpService.get(`sales/email_invoice?invoice=${data.invoice}&email=mejiasmark9@gmail.com`).subscribe((res: any) => {
      console.log(res);
      if (res.status == 200) {
        this.newToast.success("Invoice Sent to Email")
      }
    }, (err) => {
      this.newToast.error("something went wrong")
    })
  }
  addTip(data) {
    this.newToast.error('Add tip is not yet available')
  }
  moveAddReview(historyItem: any) {
    let reviewCredentials = {
      appointmentId: historyItem._id,
      companyId: historyItem.location,
      clientId: historyItem.client._id,
      therapistId: historyItem.staff.id,
      therapistName: historyItem.staff.firstName,
      therapistImage: historyItem.staff.image,
      therapistGender: historyItem.staff.gender,
      locationName: historyItem.locationDetail[0]?.name || '',
      locationImage: historyItem.locationDetail[0]?.profileImg[0]?.img || '',
      serviceName: historyItem.service.name,
      reviewCount: historyItem.staff.rating?.star_count || 0,
      rateCount: historyItem.staff.rating?.star || 0,
      duration: historyItem.duration,
      date: moment(historyItem.startTime).format('MMM DD YYYY'),
    }
    localStorage.setItem('reviewCredentials', JSON.stringify(reviewCredentials))
    this._route.navigate(['/review'])
  }
  goToSendrequest() {
    this._route.navigate(['/my-request'])
  }
  goToSelect(data: any) {
   let bookingDetails:any = {
      shop: {
       locationId: data.location,
       ownerId: data.locationDetail[0]?.ownerId,
       name: data.locationDetail[0]?.name,
       loyaltyPoints: data.locationDetail[0]?.loyalty_points || 0,
       rating: data.locationDetail[0]?.ratting,
        address: {
          bldg: data.locationDetail[0]?.building,
          street: data.locationDetail[0]?.street,
          city: data.locationDetail[0]?.city,
          state: data.locationDetail[0]?.state,
          zip: data.locationDetail[0]?.zip,
        },
       image: data.locationDetail[0]?.profileImage,
      }
    }
    bookingDetails.therapist = {
      _id: data.staff?.id,
      firstName: data.staff?.firstName,
      lastName: data.staff?.lastName,
      image: data.staff?.image,
      gender: data.staff?.gender
    }
    this.bookingService.setBookingDetails(bookingDetails);
    this._route.navigate(['/service']);
  }

  cancelAppointment(clientId: any, booking_reference: any, location: any, content: any) {
    console.log(clientId, booking_reference)
    this.location = location
    this.modalService.open(content, { centered: true })
    //  this.modalService.open()
    if (this.policy == true) {
      let param = new HttpParams()
        .set('clientId', clientId)
        .set('booking_reference', booking_reference)
      this.httpService.deleteNew(`appointment_delete`, param).subscribe((res: any) => {
        console.log(res);
        this.modalService.open(content, { centered: true, });
        this.getData()
      }, err => {
        console.log(err);
        const mod = this.modalService.open(content, { centered: true, });
        mod.dismissed.subscribe(res => {
          console.log(res);
          this.getData();
        })
      })
    }
  }

  cancelPolicy() {
    if (this.modalForm.valid) {
      this.service.get(`location/${this.location}`).subscribe((res: any) => {
        console.log(res);
        this.policy = true
      })
    }
  }

  goToHome() {
    this.modalService.dismissAll();
  }

  editAppointment(appointment: any) {
    if(appointment && appointment.locationDetail && appointment.locationDetail[0]) {
      const { _id, ownerId, name } = appointment.locationDetail[0];
      const bookingDetails: any = {
        editAppointment: {
          appointmentId: appointment?._id,
          specialPrice: appointment?.special_price,
          price: appointment?.price
        },
        shop: {
          locationId: _id,
          ownerId,
          name
        },
      }
      this.bookingService.bookingData = bookingDetails;
      this.router.navigate(['/service']);
    }
  }

  paymentMethod(data: any) {
    this._route.navigate(['/pay'], {
      queryParams: {

        intakeId: data.intakeId,
        durationHour: data.duration,
        durationMin: data.duration,
        startDate: data.startTime,
        endDate: data.endTime,
        ownerId: data.ownerId,
        // servicePricingName:data.servicePricingName,
        loyalityPoint: data.service.loyalityPoint,
        loyaltyPointCanRedeem: data.service.loyaltyPointCanRedeem,
        loyaltyPointRecieve: data.service.loyaltyPointRecieve,
        shopName: data.shopName,
        serviceName: data.service.name,
        // serviceTime:data.day,
        servicePrice: data.price,
        therapistName: data.staff.firstName,
        // timeSlot:data.timeSlot,
        serviceId: data.service.id,
        therapistId: data.staff.id,
        locationId: data.location

      }
    })
  }

  goToTip() {
    this._route.navigate(['nav/my-backpack'])
  }

  getAppointmentListing(): void {
    this.isLoading = true;
    const customer = this.getCookie('customerLogin');
    if (!!customer) {
      this.httpService.getAppointmentsListing(JSON.parse(customer).result._id).subscribe((res: any) => {
        let upcomingArr = res.result?.upcoming ?? [];
        this.appointmentsUpcoming = upcomingArr.sort((a,b) =>  new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        let history = res.result?.past ?? [];
        this.appointmentsHistory = history.sort((a,b) =>  new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        this.isLoading = false;
      }, err => {
        console.log(err);
        this.isLoading = false;
      })
    }
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
   
  setDefaultShopImage(e: any) {
    e.target.src = './assets/images/no_image.png';
  }
  
  showPopup(confirmationContent: any, failedContent: any, appointment: any) {
    this.selectedAppointment = appointment;
    const today = moment(new Date());
    const startTime = moment(appointment?.startTime);
    const duration = moment.duration(startTime.diff(today));
    const hours = duration.asHours();
    console.log(hours)
    const content = hours > 3 ? confirmationContent: failedContent;
    this.modalService.open(content, { centered: true });
  }

  cancelAction(confirmation, failed, upcoming) {
    this.selectedAppointment = upcoming;
    this.service.get(`get_location/${upcoming.location}`)
    .subscribe(res => {
      let time = res.result.onlineBookingRules?.editTime
      this.cancelAndEditRestrictionTime = time || 1;
      let bookingStartTime = moment(upcoming.startTime);
      let currentTime = moment(new Date());
      let diff = moment.duration(bookingStartTime.diff(currentTime));
      let diffHours = diff.asHours();
      let content = this.cancelAndEditRestrictionTime >= diffHours ? failed : confirmation;
      this.modalService.open(content, { centered: true });
    })
  }

  editAction(editFailed, upcoming) {
    console.log(upcoming);
    this._route.navigate(['appointment/edit'],{ queryParams: { appointmentId: upcoming._id }});
    return;
    this.selectedAppointment = upcoming;
    this.service.get(`get_location/${upcoming.location}`)
    .subscribe(res => {
      let time = res.result.onlineBookingRules?.editTime
      this.cancelAndEditRestrictionTime = time || 1;
      let bookingStartTime = moment(upcoming.startTime);
      let currentTime = moment(new Date());
      let diff = moment.duration(bookingStartTime.diff(currentTime));
      let diffHours = diff.asHours();
      if(this.cancelAndEditRestrictionTime >= diffHours) {
        this.modalService.open(editFailed, { centered: true });
      } else {
        this.editAppointment(upcoming);
      }
    })
  }

  remove(){
    this.modalService.dismissAll();
    this.isLoading = true;
    this.scheduleservice.cancelAppointment(this.selectedAppointment?.booking_reference)
    .subscribe(res => {
      this.newToast.success('Cancelled Successfully');
      this.getAppointmentListing();
    }, err => {
      this.isLoading = false;
    })
  }
  rebook(data){
    console.log(data);
    this._route.navigate(['appointment/rebook'],{ queryParams: { appointmentId: data._id }});
  }
}
