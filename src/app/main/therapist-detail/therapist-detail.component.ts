import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { BookingService } from 'src/app/services/booking.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from "rxjs";
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeServiceService } from '../home/home-service.service';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-therapist-detail',
  templateUrl: './therapist-detail.component.html',
  styleUrls: ['./therapist-detail.component.scss']
})
export class TherapistDetailComponent implements OnInit {
  userData: any;
  therapistId: any;
  newDate: any;
  companyName:any;
  companyStreet:any;
  therapist:any;
  totalStar:any
  star_count:any
  public isCollapsed = false;
  timingAvailable: any;
  servicesProvided: any = [];
  serviceData : any = [];
  ownerId: any;
  categoryId: any;
  shopName: any;
  id:any
  locationId:any;
  therapistDetails: any;
  therapistDescription: any;
  showFullDescription: boolean = false;
  languages: any;

  moment: any = moment;
  isFavouriteShop: boolean = false;
  isMobile: boolean = false;
  selectedServiceObj: any;

  subscription!: Subscription;
  isLoading: boolean = false;
  
  isContentToggled: boolean = false;
  isReadMore = false;

  bookingDetails: any;
  businessLocation: any;
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 30,
    navText: ['<span class="material-icons-outlined"> arrow_back_ios </span>', '<span class="material-icons-outlined"> arrow_forward_ios </span>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 3
      }
    },
    nav: false
  }
  constructor(
    private activatedRoute: ActivatedRoute ,
    private httpService: ApiServicesService,
    private router:Router,
    private modalService: NgbModal,
    private authService:AuthServiceService,
    private bookingService: BookingService,
    private homeService :HomeServiceService
  ) {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.locationId = params['locationId'];
    });
    if (this.locationId) {
    let shopDetails:any;
    this.httpService.get(`get_shop_detail?locationId=${this.locationId}&detail=true`).subscribe(res => {
     shopDetails = res.result;
      let bookingDetails: any = {
        shop: {
          locationId: this.locationId,
          ownerId: shopDetails?.ownerid,
          name: shopDetails?.locationName,
          loyaltyPoints: shopDetails?.loyalty_points,
          rating: shopDetails?.locationRating,
          address: {
            bldg: shopDetails?.companyBuilding,
            street: shopDetails?.companyStreet,
            city: shopDetails?.companyCity,
            state: shopDetails?.companyState,
            zip: shopDetails?.companyZip,
          },
          image: shopDetails.profileImage,
        }
      }
      this.bookingService.bookingData = bookingDetails;
    })
    
  }
  }

  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();
    this.userData = this.authService.getUserData();
    this.businessLocation = localStorage.getItem('businessLocation') && JSON.parse(localStorage.getItem('businessLocation'));
    this.subscription = this.bookingService.getBookingDetails().subscribe((details: any) => {
      if(!details && this.businessLocation) {
        details = {
          shop: {
            locationId: this.businessLocation?._id,
            ownerId: this.businessLocation?.ownerid,
            name: this.businessLocation?.locationName,
            loyaltyPoints: this.businessLocation?.loyalty_points,
            rating: this.businessLocation?.locationRating,
            address: {
              bldg: this.businessLocation?.companyBuilding,
              street: this.businessLocation?.companyStreet,
              city: this.businessLocation?.companyCity,
              state: this.businessLocation?.companyState,
              zip: this.businessLocation?.companyZip,
            },
            image: this.businessLocation.profileImage,
          }
        }
        this.bookingService.bookingData = details;
      }
      if (!this.locationId && (!details || !details.shop || !details.shop.ownerId || !details.shop.locationId)) {
        // this.router.navigate(['/']);
      } else {
        this.bookingDetails = details;
      }
    })
    this.getTherapistId();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  getTherapistId() {
    this.isLoading = true;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.activatedRoute.params
    .subscribe(params => {
      this.therapistId = params['therapistId'];
    });
    if(this.therapistId) {
      this.businessLocation = null;
    } else {
      this.activatedRoute.params
        .subscribe(params => {
        const therapist = params['therapist'];
        if(therapist) {
          this.therapistId = therapist.split('-')[1];
        } else {
          this.router.navigate(['/']);
        }
      });
    }
   this.getTherapistDetails()
  }

  getTherapistDetails() {
    this.httpService.get(`get_therapist/${this.therapistId}`).subscribe(res => {
      this.isLoading = false;
      this.therapistDetails = res.result;
      if(this.therapistDetails.reviews && this.therapistDetails.reviews.length > 3) {
        this.therapistDetails.reviews = (this.therapistDetails.reviews).slice(0, 3);
      }
      if(this.therapistDetails.service_list && this.therapistDetails.service_list.length > 3) {
        this.therapistDetails.service_list = (this.therapistDetails.service_list).slice(0, 3);
      }
      const therapistLanguages = this.therapistDetails?.languages && this.therapistDetails?.languages.length && this.therapistDetails?.languages.map((language: any) => language.name);
      this.languages = therapistLanguages && therapistLanguages.length && therapistLanguages.join(', ');
      if(this.isMobile) {
        this.therapistDescription = this.therapistDetails.descriptions && (this.therapistDetails.descriptions).slice(0, 86) + '...';
      }else {
        this.therapistDescription = this.therapistDetails.descriptions;
      }

      if (this.therapistDetails && this.therapistDetails.favFlag) {
        this.isFavouriteShop = true;
      }
      if (!this.locationId) {
        let locationId = this.therapistDetails.location[0]._id;
        this.getTherapistShopDetails(locationId);
      }
      let therapist = {
        _id: this.therapistDetails._id,
        firstName: this.therapistDetails.firstName,
        lastName: this.therapistDetails.lastName,
        image: this.therapistDetails?.image,
        gender: this.therapistDetails?.gender
      }
      this.bookingService.bookingData.therapist = therapist;
    }, err => {
      this.isLoading = false;
    })
  }
  getTherapistShopDetails(locationId) {
    let shopDetails:any;
    this.httpService.get(`get_shop_detail?locationId=${locationId}&detail=true`)
    .subscribe(res => {
     shopDetails = res.result;
      let shop = {
          locationId: locationId,
          ownerId: shopDetails?.ownerid,
          name: shopDetails?.locationName,
          loyaltyPoints: shopDetails?.loyalty_points,
          rating: shopDetails?.locationRating,
          address: {
            bldg: shopDetails?.companyBuilding,
            street: shopDetails?.companyStreet,
            city: shopDetails?.companyCity,
            state: shopDetails?.companyState,
            zip: shopDetails?.companyZip,
          },
          image: shopDetails.profileImage,
      }
      this.bookingService.bookingData.shop = shop;
    })
  }
    addTherapistTofavourite(){
    if (!this.userData) {
      let qParams: any;
      this.activatedRoute.queryParams.subscribe(params => {
        qParams = params;
      });
      qParams = _.cloneDeep(qParams);
      qParams.pathUrl = window.location.pathname;
      this.router.navigate(['auth/login'], {queryParams : qParams});
      return false;
    }

    if (this.isFavouriteShop)
    {
      this.httpService.delete(`therapist/${this.therapistId}`).subscribe(res => {
        if (res && res.status == 200) {
          this.isFavouriteShop = false;
        }
      });
    }
    else
    {
      let payload = {
        "favTherapist": this.therapistId
      };
      this.httpService.put(`update_profile?id=${this.userData.result._id}&clientId=${this.userData.client}`, payload)
        .pipe(distinctUntilChanged())
        .subscribe(res => {
        if (res && res.status == 200) {
          this.isFavouriteShop = true;
        }
      });
    }
  }

  setDefaultTherapistPic(e: any, gender: string) {
    if(gender === 'Male') {
      e.target.src = './assets/images/male-therapist.svg';
    } else {
      e.target.src = './assets/images/female-therapist.svg';
    }
  }

  setDefaultUserPic(e: any, gender: string, review) {
    if (review && review.anonymous) {
      if (gender === 'Male') {
        e.target.src = './assets/images/anonymous-male.svg';
      } else {
        e.target.src = './assets/images/anonymous-female.svg';
      }
    }
    else {
      if (gender === 'Male') {
        e.target.src = './assets/images/male-user.svg';
      } else {
        e.target.src = './assets/images/female-user.svg';
      }
    }

  }

  setDefaultServicePic(e: any) {
    e.target.src = './assets/images/service.png';
  }

  toggleFullDescription() {
    if(this.showFullDescription) {
      this.therapistDescription = (this.therapistDetails.descriptions).slice(0, 86) + '...';
      this.showFullDescription = false;
    } else {
      this.therapistDescription = this.therapistDetails.descriptions;
      this.showFullDescription = true;
    }
  }

  navigateToSelectService() {
    if(this.businessLocation) {
      this.router.navigate(['/booking']);
    } else {
      this.router.navigate(['/service']);
    }
  }

  customerDetail(client:any){
    if(client.customerId){
      this.router.navigate(['/customer-detail/' + client.customerId._id]);
    }
  }

    likeComment(_id: any) {
    if(!this.userData){
      const modal = this.modalService.open(LoginPopupComponent,{
        centered : true
      })
    return;
    }
    let data =
    {
      "review_id": _id,
      "like": {
        
        "customerId": this.userData.result._id
      }
    }
    if(this.therapistDetails.reviews.length){
      this.therapistDetails.reviews.forEach(element => {
        if(element._id == _id){
        if(element.like.length){
          let data : any = [];
           data = element.like;
          element.like.forEach(ele => {
            var newThis = this;
            const index = _.findIndex(data, function (i) {
              return (
                ele.customerId._id == newThis.userData.result._id
              );
            });
            if(index == -1){
              element.like.push({
                customerId : {_id : this.userData.result._id}
              })
              if(element.dislike.length){
                let newData : any = [];
                newData = element.dislike;
                element.dislike.forEach(ele => {
                  var newThis = this;
                  const index = _.findIndex(newData, function (i) {
                    return (
                      ele.customerId._id == newThis.userData.result._id
                    );
                  });
                  if(index === -1){
                    // element.like.push({
                    //   customerId : {_id : this.userData.result._id}
                    // })
                  }else {
                    element.dislike = element.dislike.splice(index,1);
                  }
                });
              }
            }else {
              element.like = element.like.filter((item)=>{item.customerId._id != this.userData.result._id}); 
            }
          });
  
        }else{
          element.like.push({
            customerId : {_id : this.userData.result._id}
          }) 
          if(element.dislike.length){
            let newData : any = [];
            newData = element.dislike;
            element.dislike.forEach(ele => {
              var newThis = this;
              const index = _.findIndex(newData, function (i) {
                return (
                  ele.customerId._id == newThis.userData.result._id
                );
              });
              if(index === -1){
                // element.like.push({
                //   customerId : {_id : this.userData.result._id}
                // })
              }else {
                element.dislike = element.dislike.filter((item)=>{item.customerId._id != this.userData.result._id}); 
                // element.dislike.pop();
              }
            });
          }
        }
  
        // if(element.like.length == 0){
        //   element.like.push({
        //     customerId : {_id : this.userData.result._id}
        //   })
        // }
      }
      });
    }
    this.httpService.post(`reviewComment`, data).subscribe((res: any) => {
      if (res.status == 200) {
        // this.getTherapistDetails();
      }
      // this.getTherapistDetails();
    })
  }

  //Dislike Comment
  dislikeComment(_id: any) {
    if(!this.userData){
      const modal = this.modalService.open(LoginPopupComponent,{
        centered : true
      })
      return;
    }
    let data =
    {
      "review_id": _id,
      "dislike": {
        
        "customerId": this.userData.result._id
      }
    }
    if(this.therapistDetails.reviews.length){
      this.therapistDetails.reviews.forEach(element => {
        if(element._id == _id){
        if(element.dislike.length){
          let data : any = [];
           data = element.dislike;
          element.dislike.forEach(ele => {
            var newThis = this;
            const index = _.findIndex(data, function (i) {
              return (
                ele.customerId._id == newThis.userData.result._id
              );
            });
            if(index == -1){
              element.dislike.push({
                customerId : {_id : this.userData.result._id}
              })
              if(element.like.length){
                let newData : any = [];
                newData = element.like;
                element.like.forEach(ele => {
                  var newThis = this;
                  const index = _.findIndex(newData, function (i) {
                    return (
                      ele.customerId._id == newThis.userData.result._id
                    );
                  });
                  if(index === -1){
                    // element.like.push({
                    //   customerId : {_id : this.userData.result._id}
                    // })
                  }else {
                    element.like = element.like.splice(index,1);
                  }
                });
              }
            }else {
              element.dislike = element.dislike.filter((item)=>{item.customerId._id != this.userData.result._id}); 
            }
          });
  
        }else{
          element.dislike.push({
            customerId : {_id : this.userData.result._id}
          }) 
          if(element.like.length){
            let newData : any = [];
            newData = element.like;
            element.like.forEach(ele => {
              var newThis = this;
              const index = _.findIndex(newData, function (i) {
                return (
                  ele.customerId._id == newThis.userData.result._id
                );
              });
              if(index === -1){
                // element.like.push({
                //   customerId : {_id : this.userData.result._id}
                // })
              }else {
                element.like = element.like.filter((item)=>{item.customerId._id != this.userData.result._id}); 
                // element.dislike.pop();
              }
            });
          }
        }
  
        // if(element.like.length == 0){
        //   element.like.push({
        //     customerId : {_id : this.userData.result._id}
        //   })
        // }
      }
      });
    }
    this.httpService.post(`reviewComment`, data).subscribe((res: any) => {
      // this.getTherapistDetails();
    })
  }

  checkLikeDislike(d: any, type?:any){
    let reviewLikeId = _.map(d.like, 'customerId._id');
    let reviewDislikeId = _.map(d.dislike, 'customerId._id');

    if(!this.userData)
    return;
    
    switch (type) {
      case 'like':
        if (reviewLikeId.indexOf(this.userData.result._id) >=0) {
          return true;
        }
        break;
      case 'dislike':
        if (reviewDislikeId.indexOf(this.userData.result._id) >=0) {
          return true;
        }
        break;

      default:
        return '';
    }
  }

  openScrollableContent(review:any) {
    this.router.navigateByUrl('/comment/' + review._id);
    this.homeService.sendCommentData(review);
    // const openLocationRef = this.modalService.open(CommentComponent, { scrollable: true });
    // openLocationRef.componentInstance.name = 'Comments';
    // openLocationRef.componentInstance.data = review;
    // openLocationRef.result.then(
    //   result => {
    //     this.getTherapistDetails();
    //   },
    //   reason => {
    //     this.getTherapistDetails();
    //   })
  }

  openCommentPage(review:any) {
    this.router.navigateByUrl('/comment/' + review._id);
    this.homeService.sendCommentData(review);
    // const openLocationRef = this.modalService.open(CommentComponent, { scrollable: true });
    // openLocationRef.componentInstance.name = 'Comments';
    // openLocationRef.componentInstance.data = {};
  }

  navigateToTherapistRating() {
    if(this.businessLocation) {
      this.router.navigate(['/reviews', (this.therapistDetails?.firstName).toLowerCase() + '-' + this.therapistId]);
    } else {
      this.router.navigate(['/therapist-rating', this.therapistId]);
    }
  }

  toggleContent() {
    this.isContentToggled = !this.isContentToggled;
    // this.content = this.isContentToggled ? this.nonEditedContent : this.formatContent(this.content);
  }

  displayText(cont) {
    let ln = cont.length;
    if(ln > 40 && !this.isContentToggled) {
      this.isReadMore = true;
     cont = cont.slice(0, 40) + "...";
    } else {
      this.isReadMore = false;
    }
    return cont;
  }
  imgLink(e, _for?) {
    if(e === undefined || e === null) {
      return e;
    } else {
      let splitLink = e.split("/");
      return `${environment.image_url}/uploads/${splitLink[splitLink.length - 1]}`;
    }
  }
}
