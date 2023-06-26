import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { Options } from '@angular-slider/ngx-slider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-profiles-photo',
    templateUrl: './profile-photo.component.html',
    styleUrls: ['./profile-photo.component.scss']
})
export class ProfilePhotoComponent implements OnInit, AfterViewInit {
    public file;
    public imgURL;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    scale = 0;
    rotate = 0;
    value: number = 100;
    options: Options = {
        floor: 0,
        ceil: 10
    };
    options2: Options = {
        floor: 0,
        ceil: 360
    };
    showCropper = false;
    displayCopper = false;
    camera = false;
    transform: ImageTransform = {};
    clientProfile: any;
    profileData: any;
    customerDetails = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private ngbModal: NgbModal,
        private apiService: ApiServicesService,
        private newToast: ToasterService
) { }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.camera = params['camera']
        })

       
        const customerId = this.customerDetails?.result?._id;
        this.apiService.get(`get_profile/${customerId}`).subscribe((res: any) => {
            this.profileData = res.result;
        });
    }

    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

    ngAfterViewInit(){
        let element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
        element.click();
    }
    openSetImage() {
        this.displayCopper = true;
        if (this.file) {
            var reader = new FileReader();

            reader.onload = (e) => {
                this.profileData.image = e.target.result;
            }
            reader.readAsDataURL(this.file);
        }
    }

    goToMyprofile(){
        this.router.navigate(['/my-profile']);
    }

    changeImage(event) {
        this.displayCopper = false;
        this.file = event.target.files[0];
        console.log("file--", this.file);
        if (this.file) {
            var reader = new FileReader();

            reader.onload = (e) => {
                this.profileData.image = e.target.result;
            }
            reader.readAsDataURL(this.file);
        }
        this.imageChangedEvent = event;
    }

    scaleZoom(input) {

        this.scale = input;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }
    rotateImage(input) {

        this.rotate = input;
        this.transform = {
            ...this.transform,
            rotate: this.rotate
        };
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.file = new File([base64ToFile(event.base64)], this.file.name, { type: this.file.type });
        console.log("file-------", this.file);
        // console.log(this.croppedImage);
    }

    imageLoaded(e) {
        console.log(e);
        this.showCropper = true;
        console.log('Image loaded');
    }

    cropperReady(sourceImageDimensions: Dimensions) {
        console.log('Cropper ready', sourceImageDimensions);
    }

    loadImageFailed() {
        console.log('Load failed');
    }

    deletePhoto() {
        this.imgURL = null;
        this.file = null;
        // this.imageChangedEvent = undefined;
        let element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
        element.click();
    }

    upProfile() {
        console.log(this.file);
        const formData: any = new FormData();
        formData.append("photos", this.file);
        this.ngbModal.dismissAll();
        this.apiService.postImage("assets/uploadImages", formData).subscribe(
            (res) => {
                // this.newToast.success('Image Uploaded', true, 1000);
                this.profileData.image = this.apiService.imageProductTranslator(
                    res["result"][0]
                );
                this.saveProfile();
                // this.createClientWithImage(form.value);
            },
            (rej) => {
                this.newToast.error('Image Upload Failed', true, 1000);
                console.log("rej", rej);
            }
        );
    }

    confirmPopup(content){
        this.ngbModal.open(content, { centered: true });
    }

    saveProfile(){
        const data = { image : this.profileData.image}
        const customerId = this.customerDetails?.result?._id;
        const clientId = this.customerDetails?.client;
        this.apiService.put(`update_profile?id=${customerId}&clientId=${clientId}`, data).subscribe((res: any) => {
            let customerDetails = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
            customerDetails.result = res.result;
            this.setCookie('customerLogin',JSON.stringify(customerDetails));
            this.apiService.setLoginData(customerDetails);
            this.newToast.success(res.message);
            this.goToMyprofile();
        })
    }

    setCookie(name, value) {
      const extraDays = 6;
      var d = new Date();
      d.setTime(d.getTime()+(extraDays * 24 * 60 * 60 * 1000));
      const expires = "expires=" + d.toUTCString();
      if(document.domain === 'localhost') {
        document.cookie = name +'='+ value +'; path=/; '+ expires + ';';
      } else {
        document.cookie = name +'='+ value +'; domain=.thebookus.com; path=/; '+ expires + ';';
      }
    }

}
