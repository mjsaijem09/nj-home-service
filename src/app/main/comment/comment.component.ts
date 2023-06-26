import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { BookingService } from 'src/app/services/booking.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { filter } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HomeServiceService } from '../home/home-service.service';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { Subscription } from 'rxjs';
// import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy {
   @Input() data: any;
   @ViewChild('bodyName') bodyName: ElementRef;
  userData: any;
  locationId: any;
  newDate: any;
  shopDetails:any;
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
  therapistDetails:any=[];
  moment: any = moment;
  isFavouriteShop: boolean = false;
  isMobile: boolean = false;
  displayComment: boolean = true;
  selectedServiceObj: any;
submitted = false;
  shopImages = [1, 2, 3];
  commentForm!: UntypedFormGroup
  anonymous = false;
  selectedComment:any;
  selectedReview:any;
  subscription!: Subscription;
  constructor(
    private NgbModal:NgbModal,
    private httpService: ApiServicesService,
    private router:Router,
    private formBuilder: UntypedFormBuilder,
    private authService:AuthServiceService,
    private bookingService: BookingService,
    private activatedRoute: ActivatedRoute,
    private homeService :HomeServiceService
  ) {
    this.subscription = this.homeService.getCommentData.subscribe(res=>{
      console.log(res);
      this.selectedReview = res;
      console.log("this.selectedReview-----", this.selectedReview)
    })
  }

  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();
    this.userData = this.authService.getUserData();
    this.anonymous = this.userData ? false : true;
     this.commentForm = this.formBuilder.group({
          body: ['', Validators.required],
        });
         this.activatedRoute.params
           .subscribe(params => {
               this.id= params['id']
            })
    this.getDetails();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  navigateBack(){
    this.NgbModal.dismissAll();
  }

  handleLike() {
     _.each(this.data.comment, (d) => {
      d.isLike = this.checkLikeDislike(d, 'like')
      d.isDislike = this.checkLikeDislike(d, 'dislike')
       _.each(d.reply, (dt) => {
         dt.isLike = this.checkLikeDislike(dt, 'like', true)
         dt.isDislike = this.checkLikeDislike(dt, 'dislike', true)
       })
    })
  }

  setDefaultPersonPic(e: any, gender: string) {
    if(gender === 'Male') {
      e.target.src = './assets/images/male-user.svg';
    } else {
      e.target.src = './assets/images/female-user.svg';
    }
  }
  
  get f() { return this.commentForm.controls; }

  checkLikeDislike(d: any, type?:any, isreply?){
    let reviewLikeId = _.map(d.like, 'customerId._id');
    let reviewDislikeId = _.map(d.dislike, 'customerId._id');
    
    if (isreply){
      reviewLikeId = _.map(d.like, 'customerId');
      reviewDislikeId = _.map(d.dislike, 'customerId');
    }

    if(!this.userData)
    return false; 
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
        return false;
    }
  }

    getDetails() {
  //  this.data.comment = [];
    this.httpService.get(`review/`+ this.id).subscribe((res: any) => {
      if (res.status == 200 && res.result && res.result.length >0) {
        this.data = res.result[0];
        console.log("data-------------", this.data)
        this.handleLike();
      }
    })
  }

    setDefaultUserPic(e: any, gender: string) {
      if(gender){
      if(gender === 'Male') {
            e.target.src = './assets/images/male-user.svg';
          } else {
            e.target.src = './assets/images/female-user.svg';
          }
      } else {
        e.target.src="./assets/images/user.svg"
      }
   
  }
  setDefaultAnonyPic(gender: string) {
      if(gender){
      if(gender === 'Male') {
        return './assets/images/anonymous-male.svg';
        } else {
        return  './assets/images/anonymous-female.svg';
        }
      } else {
        return "./assets/images/user.svg"
      }
   
  }

  likeComment(_id: any, selected) {
    if (!this.userData) {
      const modal = this.NgbModal.open(LoginPopupComponent, {
        centered: true
      })
      return;
    }
    let data = {}
    if(!selected) {
      data = {
        "review_id": this.data._id,
        "commentId": _id,

        "comment": {
          "like": {

            "customerId": this.userData.result._id
          }
        }
      }
    } else {
      data =
      {
        "review_id": _id,
        "like": {

          "customerId": this.userData.result._id
        }
      }
    }
   
    if (!selected && this.data.comment.length) {
      this.data.comment.forEach(element => {
        if (element._id == _id) {
          if (element.like.length) {
            let data: any = [];
            data = element.like;
            element.like.forEach(ele => {
              var newThis = this;
              const index = _.findIndex(data, function (i) {
                return (
                  ele.customerId._id == newThis.userData.result._id
                );
              });
              if (index == -1) {
                element.like.push({
                  customerId: { _id: this.userData.result._id }
                })
                if (element.dislike.length) {
                  let newData: any = [];
                  newData = element.dislike;
                  element.dislike.forEach(ele => {
                    var newThis = this;
                    const index = _.findIndex(newData, function (i) {
                      return (
                        ele.customerId._id == newThis.userData.result._id
                      );
                    });
                    if (index === -1) {
                      // element.like.push({
                      //   customerId : {_id : this.userData.result._id}
                      // })
                    } else {
                      element.dislike = element.dislike.splice(index, 1);
                    }
                  });
                }
              } else {
                element.like = element.like.filter((item) => { item.customerId._id != this.userData.result._id });
              }
            });

          } else {
            element.like.push({
              customerId: { _id: this.userData.result._id }
            })
            if (element.dislike.length) {
              let newData: any = [];
              newData = element.dislike;
              element.dislike.forEach(ele => {
                var newThis = this;
                const index = _.findIndex(newData, function (i) {
                  return (
                    ele.customerId._id == newThis.userData.result._id
                  );
                });
                if (index === -1) {
                  // element.like.push({
                  //   customerId : {_id : this.userData.result._id}
                  // })
                } else {
                  element.dislike = element.dislike.filter((item) => { item.customerId._id != this.userData.result._id });
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
    this.handleLike();
    this.httpService.post(`reviewComment`, data).subscribe((res: any) => {
      if (res.status == 200) {
        // this.getDetails();
      }
    })
  }
  //Dislike Comment
  dislikeComment(_id: any, selected) {
    if(!this.userData){
      const modal = this.NgbModal.open(LoginPopupComponent,{
        centered : true
      })
      return;
    }
    let data = {}
    if(!selected){
    data = {
      "review_id":this.data. _id,
      "commentId": _id,
      "comment": {"dislike": {
       
        "customerId": this.userData.result._id
      }}
    }
  } else {
      data ={
        "review_id": _id,
          "dislike": {

          "customerId": this.userData.result._id
        }
      }
  }
    if (!selected && this.data.comment.length) {
      this.data.comment.forEach(element => {
        if (element._id == _id) {
          if (element.dislike.length) {
            let data: any = [];
            data = element.dislike;
            element.dislike.forEach(ele => {
              var newThis = this;
              const index = _.findIndex(data, function (i) {
                return (
                  ele.customerId._id == newThis.userData.result._id
                );
              });
              if (index == -1) {
                element.dislike.push({
                  customerId: { _id: this.userData.result._id }
                })
                if (element.like.length) {
                  let newData: any = [];
                  newData = element.like;
                  element.like.forEach(ele => {
                    var newThis = this;
                    const index = _.findIndex(newData, function (i) {
                      return (
                        ele.customerId._id == newThis.userData.result._id
                      );
                    });
                    if (index === -1) {
                      // element.like.push({
                      //   customerId : {_id : this.userData.result._id}
                      // })
                    } else {
                      element.like = element.like.splice(index, 1);
                    }
                  });
                }
              } else {
                element.dislike = element.dislike.filter((item) => { item.customerId._id != this.userData.result._id });
              }
            });

          } else {
            element.dislike.push({
              customerId: { _id: this.userData.result._id }
            })
            if (element.like.length) {
              let newData: any = [];
              newData = element.like;
              element.like.forEach(ele => {
                var newThis = this;
                const index = _.findIndex(newData, function (i) {
                  return (
                    ele.customerId._id == newThis.userData.result._id
                  );
                });
                if (index === -1) {
                  // element.like.push({
                  //   customerId : {_id : this.userData.result._id}
                  // })
                } else {
                  element.like = element.like.filter((item) => { item.customerId._id != this.userData.result._id });
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
    this.handleLike();
    this.httpService.post(`reviewComment`, data).subscribe((res: any) => {
       if (res.status == 200) {
        // this.getDetails();
      }
    })
  }
  likeReply(_id: any, comment) {
    if(!this.userData)
    return; 
    let data ={     
      "ratingId": this.data._id,
      "commentId": comment._id,
      "replyId":_id,
      "like": {
        "customerId": this.userData.result._id
      }
    }
    this.httpService.post(`reply_to_comment`, data).subscribe((res: any) => {
       if (res.status == 200) {
        this.getDetails();
      }
    })
  }
  dislikeReply(_id: any, comment) {
    if(!this.userData)
    return; 
    let data ={     
      "ratingId": this.data._id,
      "commentId": comment._id,
      "replyId":_id,
      "dislike": {
        "customerId": this.userData.result._id
      }
    }
    this.httpService.post(`reply_to_comment`, data).subscribe((res: any) => {
       if (res.status == 200) {
        this.getDetails();
      }
    })
  }
 onSubmit() {
    this.submitted = true
    if(this.selectedComment){
      let data = {
       
        "reply": this.commentForm.value.body,
        "customerId": this.anonymous ? undefined : this.userData.result._id,
        "ratingId": this.data. _id,
        "commentId": this.selectedComment. _id
      }

      if (this.commentForm.valid) {
        this.httpService.post(`reply_to_comment`, data).subscribe((res: any) => {
          this.getDetails();
        })
      }
    } else{
      let data = {
        "comment":
        {
          "body": this.commentForm.value.body,
          "customerId": this.anonymous ? undefined : this.userData.result._id
        },
        "review_id": this.data. _id
      }

       if (this.commentForm.valid) {
        this.httpService.post(`reviewComment`, data).subscribe((res: any) => {
          this.selectedReview.comment.push(res)
          this.getDetails();
        })
      }
    }

    // stop here if form is invalid
   
    this.commentForm.reset()
    this.submitted = false;
    this.selectedComment = undefined;
  }

  replyComment(commentItem){
    if(commentItem._id == this.selectedComment?._id){
      this.selectedComment = undefined;
      this.commentForm.controls.body.setValue("");
      commentItem.isDisplyBlock = false;
      return;
    }
    this.selectedComment = commentItem;
    commentItem.isDisplyBlock = true;
    const val = '@'+ commentItem?.customerId?.firstName + ' ' +commentItem?.customerId?.lastName + ' - '
    this.commentForm.controls.body.setValue(val);
    this.bodyName.nativeElement.focus();
  }
  goTOReview(){
    this.router.navigate(['/all-reviews'],{queryParams: {
      locationId: this.locationId
    }});
  }
}
