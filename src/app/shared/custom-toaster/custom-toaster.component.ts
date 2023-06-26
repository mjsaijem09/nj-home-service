import { Component, OnInit } from '@angular/core';
import { ToasterService } from './toaster.service';

@Component({
  selector: 'app-custom-toaster',
  templateUrl: './custom-toaster.component.html',
  styleUrls: ['./custom-toaster.component.scss']
})
export class CustomToasterComponent implements OnInit {
  toastMsg: any[] = [];


  constructor(public toastService: ToasterService) { }

  // method to initialize first
  ngOnInit() {
    // call the alert service to display a message on success and on error
    this.toastService.getMessage().subscribe(d => {
      if (!d) {
        return;
      }
      this.toastMsg.unshift(d);
      this.setHide(d.msgId, d.timer);
    });
  }
  setHide(msgId:any, timer:any) {
    setTimeout(() => {
      const index = this.toastMsg.findIndex(x => x.msgId === msgId);
      this.toastMsg.splice(index, 1);
    }, timer);
  }

  closeToast(index:any) {
    const i = this.toastMsg.findIndex(x => x.msgId === index);
    this.toastMsg.splice(i, 1);
  }

}
