import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-massage-control',
  templateUrl: './massage-control.component.html',
  styleUrls: ['./massage-control.component.scss']
})
export class MassageControlComponent implements OnInit {
  @Input() data: any;
  @Input() type?: any;
  @Input() therapisList?: any;

  showMobile: boolean = false;

  models: any = [
    {
      type: 'new',
      title: 'Bookus',
      content: 'As Per Your Location, you seem to have arrived at the shop. Let us know if you have arrived so that we can notify the therapist',
      buttons: [
        {
          text: 'Not Yet',
          class: 'btn light-btn',
          close: true
        },
        {
          text: 'Arrived',
          class: 'btn btn-dark',
        }
      ]
    },
    {
      type: 'arrived',
      title: 'Bookus',
      content: 'The Therapist is ready for the service. Let us know when the therapist starts the service to charge your bill accordingly',
      buttons: [
        {
          text: 'Not Yet',
          class: 'btn btn-light',
          close: true
        },
        {
          text: 'Started',
          class: 'btn btn-dark',
        }
      ]
    },
    {
      type: 'change-therapist',
      title: 'Available Therapists',
      content: 'Successfully Sent Request',
    },
    {
      type: 'stop-service',
      content: 'Are you sure you want to end the service?',
      buttons: [
        {
          text: 'NO',
          class: 'btn btn-light',
          close: true
        },
        {
          text: 'YES',
          class: 'btn btn-dark',
        }
      ]
    },
    {
      title: 'Add More Time',
      type: 'add-more-time',
      content: '',
    }
  ]
  openModel: any;

  constructor(
    public activeModal: NgbActiveModal,
    private service: ApiServicesService,
    private newToast:ToasterService,
  ) { }

  ngOnInit(): void {
    this.openModel = this.models.find((element: any) => {
      return element.type == this.type;
    });

    let ScreenWidth = window.innerWidth
    if (ScreenWidth > 1024) {
      this.showMobile = false
    } else if (ScreenWidth < 1024) {
      this.showMobile = true
    }
    console.log(this.data);

    // if (this.type=='add-more-time') {
    //   this.data.result = this.data.result.map((item: any) => {
    //     return {
    //       extraTime: item.time - this.data.appointment.durationMin,
    //       extraPrice: item.price - (this.data.appointment.special_price || this.data.appointment.price)
    //     }
    //   })

    //   this.data.result = this.data.result.filter((item: any) => {
    //     return item.extraPrice > 0;
    //   }) || [];

    //   if (this.data.result) {
        
    //   }

    // }

  }

  closePopup(value?:boolean) {
    this.activeModal.close(value);
  }

  // arriveMassage(status: any){
  //   let paylod = [{"Id": this.data._id, "clientId": this.data.client, "status": status}];
  //   this.service.patch('appointment?location_id='+this.data.location, paylod).subscribe((res: any) => {
  //     this.activeModal.dismiss(res);
  //   },
  //   (error: any) => {
  //     this.newToast.error('something went wrong');
  //   });
  // }

  arriveMassage(status: any){
    if (status != 'started') {
      let paylod = [{"_id": this.data._id, "clientId": this.data.client, "status": status}];
      this.service.patch('customers/reschedule', paylod).subscribe((res: any) => {
        this.activeModal.close(res);
      },
      (error: any) => {
        this.newToast.error('something went wrong');
        this.activeModal.dismiss(true);
      });
      } else {
      // this.service.get('customers/set_start_time/'+this.data._id).subscribe((res: any) => {
      //   this.activeModal.close(res);
      // },
      // (error: any) => {
      //   this.newToast.error('something went wrong');
      //   this.activeModal.dismiss(true);
      // });
    }
    
  }

  addExtraTime(item:any, extraTime: any, extraPrice: any) {
    this.service.post('customers/update_staff_time/' +  this.data.appointment._id,  {
            "service_time": extraTime,"price": extraPrice}).subscribe((res: any) => {
      this.activeModal.close(res);
    },
    (error: any) => {
      this.newToast.error('something went wrong');
      this.activeModal.dismiss(true);
    });
  }

  stopService() {
    let paylod = [{"_id": this.data._id, "clientId": this.data.client, "status": 'stop', "stopByClient":true}];
    this.service.patch('customers/reschedule', paylod).subscribe((res: any) => {
      this.newToast.error('Service stoped');
      this.activeModal.close(res);
    },
    (error: any) => {
      this.newToast.error('something went wrong');
      this.activeModal.dismiss(true);
    });
  }

  action(obj: any){
    if (obj.close) {
      this.closePopup();
      return false;
    }

    switch (this.type) {
      case 'new':
      case 'arrived':
        let type = (this.type == 'new' ? 'arrived' : 'started');
        this.arriveMassage(type)
        break;

      case 'change-therapist':
       this.activeModal.close();
        break;

      case 'stop-service':
        if(obj.text == 'YES'){
          this.stopService()
        }
        break;

      default:
        break;
    }
  }

  updateTherapist(therapist: any){
    let payload = {
      staff: {
        firstName: therapist.firstName,
        id: therapist._id,
        lastName: therapist.lastName
      },
      appointmentId: this.data._id
    };
    this.service.put('customers/update_therapist',  payload).subscribe((res: any) => {
      this.activeModal.close(res.result);
    },
    (error: any) => {
      this.newToast.error('something went wrong');
      this.activeModal.dismiss(true);
    });
  }
}
