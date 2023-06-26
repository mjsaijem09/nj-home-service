import {Component, EventEmitter, Output, ViewChild, ViewEncapsulation, OnInit, ElementRef} from '@angular/core';
import {QrScannerComponent} from 'angular2-qrscanner';

import { SocketService } from '../../services/socket.service';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-scanner',
  templateUrl: 'scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent {
  @ViewChild(QrScannerComponent) qrScannerComponent!: QrScannerComponent;
  @ViewChild('successModal', { static: true }) successModal!: ElementRef;
  @ViewChild('failureModal', { static: true }) failureModal!: ElementRef;

  showScanner: boolean = false;
  deviceError;

  constructor(
    private location : Location,
    private modalService: NgbModal,
    private socketService: SocketService,
    ) {}
 
  ngOnInit() {
    this.socketService.on('fetch-booking-user-details').subscribe((data:any)=>{
      console.log("fetch-booking-user-details------------------------------------",data);
      });
    setTimeout(() => {
      this.getMedia();
    });
  }

  initializeScanner() {
      this.qrScannerComponent.getMediaDevices().then(devices => {
        const videoDevices: MediaDeviceInfo[] = [];
        for (const device of devices) {
            if (device.kind.toString() === 'videoinput') {
                videoDevices.push(device);
            }
        }
        if (videoDevices.length > 0){
            let choosenDev;
            for (const dev of videoDevices){
              if (dev.label.includes('back') || dev.label.includes('rear')){
                choosenDev = dev;
                break;
              }
            }
            if (choosenDev) {
                this.qrScannerComponent.chooseCamera.next(choosenDev);
            } else {
                this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
            }
        } else {
          this.showPopup(this.failureModal);
        }
    });

    this.qrScannerComponent.capturedQr.subscribe((result: any) => {
      console.log('result:', result)
      this.handleQRResult(result);
    }, (err: any) => {
      console.log('err:', err)
      this.showPopup(this.failureModal);
    });
  }

  async getMedia() {
    let stream = null;
  
    // try {
    //   stream = await navigator.mediaDevices.getUserMedia({video: true});
    //   if(stream.getVideoTracks().length > 0){
    //     this.showScanner = true;
    //   } else {
    //     this.showScanner = false;
    //     this.showPopup(this.failureModal);
    //   }
    //   /* use the stream */
    // } catch(err) {
    //   /* handle the error */
    //   this.showPopup(this.failureModal);
    // }

    try {
      const videoDevices: MediaDeviceInfo[] = [];
      stream = await navigator.mediaDevices.enumerateDevices().then(devices => {
        for (const device of devices) {
            if (device.kind.toString() === 'videoinput') {
                videoDevices.push(device);
            }
        }
        if (videoDevices.length > 0) {
          for (const dev of videoDevices) {
            if (dev.label.includes('back') || dev.label.includes('rear') || dev.label.includes('webcam') || dev.label.includes('Webcam')) {
              return dev;
            }
          }
        }
      });
      if(stream) {
        this.showScanner = true;
      } else {
        this.showScanner = false;
        if(videoDevices.length) {
          this.deviceError = 'Please allow camera permissions from site settings';
        } else {
          this.deviceError = 'Cam not detected';
        }
        this.showPopup(this.failureModal);
      }
      /* use the stream */
    } catch(err) {
      /* handle the error */
      this.showPopup(this.failureModal);
    }
  }
  sendData; 
  handleQRResult(uuid: string) {
   const customerDetails = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
    if(uuid && customerDetails) {
      this.sendData = {
        uuid: uuid,
        firstName: customerDetails?.result?.firstName,
        lastName: customerDetails?.result?.lastName,
        email: customerDetails?.result?.email,
        phone: customerDetails?.result?.mobile
      }
      // this.toaster.success('Processed!');
      this.showPopup(this.successModal);
      // this.router.navigate(['/main/home']);
    }
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  goBack() {
    this.modalService.dismissAll();
    this.location.back();
  }
  confirm() {
    this.socketService.emit('send-booking-user-details', this.sendData);
    this.modalService.dismissAll();
    this.location.back();
  }
  tryAgain() {
    this.modalService.dismissAll();
    this.showScanner = true;
    setTimeout(() => {
      // this.initializeScanner();
      this.getMedia();
    }, 800)
  }
  
  showPopup(content: any) {
    this.showScanner = false;
    this.modalService.open(content, { centered: true });
  }
}
