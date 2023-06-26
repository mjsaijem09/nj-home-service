import { AfterViewInit, Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { DeleteFevoriteTherapistComponent } from 'src/app/shared-components/delete-fevorite-therapist/delete-fevorite-therapist.component';
import {LikeService} from './like.service'

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss']
})
export class LikeComponent implements OnInit {
  shops: any = [];
  therapists: any = [];
  currTab: string = 'shop';
  isLoading!: boolean;

  constructor(
     private likeService: LikeService,
     private newToast: ToasterService,
     private ngbModal: NgbModal, 
     private router: Router
  ) {}

  ngOnInit(): void {
    this.getFavioriteShops();
  }

  getFavioriteShops() {
    this.isLoading = true;
    this.likeService.favouriteShops().subscribe((res: any) => {
      this.shops = res.result;
      this.getFavioriteTherapists();
    }, err => {console.log(err)});
  }

  getFavioriteTherapists() {
    this.likeService.favouriteTherapists().subscribe((res:any) => {
      this.therapists = res.result;
      this.isLoading = false;
    }, err => {console.log(err)});
  }
   
  showContent(type: any) {
    this.currTab = type;
  }

  setDefaultPic(e:any) {
    e.target.src = './assets/images/no_image.png'
  }

  // displayPopup(data:any, deleteVal: any) {

  //   this.NgbModal.open(DeleteFevoriteTherapistComponent, { size: 'sm', centered: true , windowClass: 'delete-therapist-modal' })
  //   .result.then((result) => {
      
  //    console.log(result);
  //   }, (reason) => {
  //     if (reason ){
  //       if (deleteVal == 'sopeDelete') {
  //         this.shopservice.delFevShop(data._id).subscribe((res:any)=>{
  //           this.favioriteShop();
  //         },err=>{console.log(err)}); 
  //       } else {
  //         this.shopservice.delFevTherapist(data._id).subscribe((res:any)=>{
  //           this.favioritetherapist();
  //         },err=>{console.log(err)}); 
  //       }
       
  //     }
  //   }
  //   )
  // }

  viewshopDetails(data: any) {
    console.log(data)
    this.router.navigate(['/shop-details'], {
      queryParams: {
        locationId: data._id,
        ownerId: data.ownerId,
        shopName: data.name,
        categoryId: data.categoryId && data.categoryId[0]
      },
    });
  }

  viewTherapistDetails(e : any) {
    this.router.navigate(['/therapist'],{queryParams:{
      theRapistId:e && e._id ? e._id : '123',
      }
    });
  }

  tipTherapist(e : any) {
    this.router.navigate(['nav/my-backpack']);
  }

  setDefaultShopPic(e: any) {
    e.target.src = './assets/images/no_image.svg';
  }

  setDefaultTherapistPic(e: any, gender: string) {
    if(gender === 'Male') {
      e.target.src = './assets/images/male-therapist.svg';
    } else {
      e.target.src = './assets/images/female-therapist.svg';
    }
  }
  name: any;
  _id: any;
  confirm(content: any, id: any, name:any) {
    this.ngbModal.open(content, { centered: true });
    this.name = name;
    this._id = id;
  }
  reload: boolean = true;
  remove(id:any, name:any){
    console.log(id);
    this.ngbModal.dismissAll();
    this.isLoading = true;
    if(name == 'shop'){
      this.likeService.delFevShop(id)
      .subscribe(res => {
        this.newToast.success('Removed Successfully');
        this.reload = false;
        this.getFavioriteShops();
        // this.ngbModal.dismissAll();
        setTimeout(() => {
          this.reload = true;
        }, 0);
      })
    }else {
      this.likeService.delFevTherapist(id)
      .subscribe(res => {
        this.newToast.success('Removed Successfully');
        this.reload = false;
        this.getFavioriteTherapists();
        // this.ngbModal.dismissAll();
        setTimeout(() => {
          this.reload = true;
        }, 100);
      })
    }
    
  }

  locateShop(shop) {
    this.router.navigate(['/shop/', shop?._id])
  }
  locateTherapist(therapist) {
    this.router.navigate(['/therapist-detail/', therapist?._id])

  }
  
}
