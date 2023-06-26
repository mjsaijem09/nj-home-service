import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment';
import { ApiServicesService } from 'src/app/services/api-services.service';

import { CameraComponent } from 'src/app/shared/camera/camera.component';

@Component({
  selector: 'app-product-to-rate',
  templateUrl: './product-to-rate.component.html',
  styleUrls: ['./product-to-rate.component.scss']
})

export class ProductToRateComponent implements OnInit {
  @ViewChild('videoThumbnail', { static: true }) videoThumbnail: ElementRef<HTMLVideoElement>;

  constructor(
    private _activeR: ActivatedRoute,
    private modalService: NgbModal,
    private _api: ApiServicesService,
    private _router: Router
    ) { }
  product
  quality = "";
  order
  ngOnInit(): void {
    this._activeR.queryParams.subscribe(params => {
      this.order = JSON.parse(params.data);
      this.product = this.order.orderItems[0];
      console.log(this.order);
      this.productId = this.product.productId._id;
      if(!this.productId) {
        this._router.navigate['/my-purchases'];
      }
    });
  }
  
  productStarRate(e) {
    console.log(e);
    if(e <= 1) {
      this.quality = "Terrible";
    } else if (e <= 2) {
      this.quality = "Poor";
    } else if (e <= 3) {
      this.quality = "Fair";
    } else if (e <= 4) {
      this.quality = "Good";
    } else {
      this.quality = "Amazing";
    }
    this.stars = e;
  }
  photos: string[] = [];
  video: string = null;
  videoDuration: string = '0:00'
  openCamera(type) {
    const options: NgbModalOptions = {
      size: 'xl',
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'camera-modal'
    };
    const modalRef = this.modalService.open(CameraComponent, options);
    modalRef.componentInstance.type = type;

    modalRef.result.then((result) => {
      if(result) {
        this.images.push(environment.image_url+result);
        if (result.includes('.png')) {
          this.photos.push(environment.image_url+result);
        } else {
          this.video = environment.image_url+result;
          if(this.video) {
            const video:any = document.getElementById('videoThumbnail');
            video.src = this.video;
            video.controls = false;
            this.getVideoDuration(this.video)
            .then(duration => {
              this.videoDuration = duration;
              console.log('Video duration:', duration);
            }).catch(error => {
              console.error('Error getting video duration:', error);
            });
          }
        }
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  removePhoto(index) {
    this.photos.splice(index, 1);
  }

  getVideoDuration(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(this.videoThumbnail)
      this.videoThumbnail.nativeElement.src = url;
      // this.videoThumbnail.nativeElement.controls = true;

      this.videoThumbnail.nativeElement.addEventListener('loadedmetadata', () => {
        if (this.videoThumbnail.nativeElement.duration === Infinity) {
          this.videoThumbnail.nativeElement.currentTime = 1e101
          this.videoThumbnail.nativeElement.addEventListener('timeupdate', () => {
            const duration = this.getDuration();
            resolve(duration);
          })
        } else {
          resolve(this.videoThumbnail.nativeElement.duration);
        }
      });
      
      this.videoThumbnail.nativeElement.addEventListener('error', reject);
    });
  }

  getDuration() {
    const videoThumbnail:any = document.getElementById("videoThumbnail");
    videoThumbnail.currentTime = 0
    videoThumbnail.removeEventListener('timeupdate', this.getDuration);
    return this.formatDuration(videoThumbnail.duration);
  }

  formatDuration(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  productId: String;
  message: String = '';
  stars: Number = 0;
  images = [];
  post() {
    let payload:any = {};
    payload.productId = this.productId;
    payload.message = this.message;
    payload.stars = this.stars;
    payload.images = this.images;
    console.log(payload);
    this._api.post(`product-rating/rate`, payload).subscribe(
      res => {
        if (res.status == 200) {
          this.orderReviewed();
        }
        console.log(res);
      },
      err => {
        console.log(err);
      }
    )
  }
  orderReviewed() {
    this.order.orderReviewed = true;
    this._api.patch(`order/${this.order._id}?isReview=true`, this.order).subscribe(
      res => {
        console.log(res)
      }
    )
  }
}