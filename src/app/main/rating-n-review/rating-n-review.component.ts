import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { BookingService } from 'src/app/services/booking.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { filter } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentComponent } from '../comment/comment.component';
import { HomeServiceService } from '../home/home-service.service';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { Observable, Subscription } from 'rxjs';
import { HttpParams, HttpRequest } from '@angular/common/http';
// import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-rating-n-review',
  templateUrl: './rating-n-review.component.html',
  styleUrls: ['./rating-n-review.component.scss']
})
export class RatingNReviewComponent implements OnInit {
  @ViewChild('serachIt') private elementRef!: ElementRef;
  @Input() public therapistId: any
  @Input() public locationId: any
  @Input() public shopWall: boolean = false;

  userData: any;
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
  selectedServiceObj: any;
  loginData: any;

  isLoading: boolean = false;
  reviewType: any;
  ratingDetails: any;
  reviews: any;
  totalReviews: any = 0;
  overallRating: any;
  percentRatings: any;
  searchTimeout: any;
  searchKeyword: string = '';
  page = 1;
  pageSize = 12;

  starFilter: IStarFilter = {
    isSet: false
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpService: ApiServicesService,
    private router:Router,
    private authService:AuthServiceService,
    private bookingService: BookingService,
    private NgbDialogService: NgbModal,
    private homeService :HomeServiceService
  ) {}

  ngOnInit(): void {
    this.isMobile = this.bookingService.isMobileView();
    this.userData = this.authService.getUserData();
    this.isLoading = true;
    this.loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
    this.starFilter.isSet = false;
    this.userFirstTime();
    this.getDetails('recentRating');
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  likeComment(review, i) {
    if(!this.loginData){
      const modal = this.NgbDialogService.open(LoginPopupComponent,{
        centered : true
      })
      return;
    }
    let data = {
      "review_id": review._id,
      "like": {
        "customerId": this.loginData.result._id
      }
    }
    // new code (20 lines)
    let likeArr = this.ratingDetails.result[i].like;
    let dislikeArr = this.ratingDetails.result[i].dislike;
    const findLikeIndex = likeArr.findIndex((el) => el.customerId == this.loginData.result._id);
    const findDisLikeIndex = dislikeArr.findIndex((el) => el.customerId == this.loginData.result._id);
    if(findLikeIndex >= 0) {
      this.ratingDetails.result[i].like.splice(findLikeIndex, 1);
    } else {
      this.ratingDetails.result[i].like.push({customerId: this.loginData.result._id});
    }
    if(findDisLikeIndex >= 0) {
      this.ratingDetails.result[i].dislike.splice(findLikeIndex, 1);
    }
    this.httpService.post(`reviewComment`, data).subscribe(
      (res) => {
        console.log("res", res);
      },
      (err) => {
        console.log("err", err);
      }
    )
    return;
    // old code (92 lines)
    if(this.ratingDetails.result.length){
    this.ratingDetails.result.forEach(element => {
      if(element._id == review._id){
        const findIndex = element.like.findIndex((el) => el.customerId == this.loginData.result._id);
        console.log("findIndex: ", findIndex);
        let obj = element.like.find(x => x.customerId == this.loginData.result._id);
        console.log("obj: ", obj);
        if(!obj) {
          element.like.push({customerId: this.loginData.result._id})
        } else {

        }
        return;
      if(element.like.length){
        // let data : any = [];
        //  data = element.like;
        element.like.forEach(ele => {
          var newThis = this;
          const index = _.findIndex(element.like, function (i) {
            return (
              ele.customerId == newThis.loginData.result._id
            );
          });
         console.log("index: ", index);
          if(index == -1){
            element.like.push({
              customerId: this.loginData.result._id
            })
            if(element.dislike.length){
              let newData : any = [];
              newData = element.dislike;
              element.dislike.forEach(ele => {
                var newThis = this;
                const index = _.findIndex(newData, function (i) {
                  return (
                    ele.customerId._id == newThis.loginData.result._id
                  );
                });
                if(index === -1){
                  // element.like.push({
                  //   customerId : {_id : this.loginData.result._id}
                  // })
                }else {
                  element.dislike = element.dislike.splice(index,1);
                }
              });
            }
          }else {
            element.like = element.like.filter((item)=>{item.customerId._id != this.loginData.result._id}); 
          }
        });

      }else{
        element.like.push({
          customerId : {_id : this.loginData.result._id}
        }) 
        if(element.dislike.length){
          let newData : any = [];
          newData = element.dislike;
          element.dislike.forEach(ele => {
            var newThis = this;
            const index = _.findIndex(newData, function (i) {
              return (
                ele.customerId._id == newThis.loginData.result._id
              );
            });
            if(index === -1){
              // element.like.push({
              //   customerId : {_id : this.loginData.result._id}
              // })
            }else {
              element.dislike = element.dislike.filter((item)=>{item.customerId._id != this.loginData.result._id}); 
              // element.dislike.pop();
            }
          });
        }
      }

      // if(element.like.length == 0){
      //   element.like.push({
      //     customerId : {_id : this.loginData.result._id}
      //   })
      // }
    }
    });
  }
    console.log(this.ratingDetails);
    this.httpService.post(`reviewComment`, data).subscribe((res: any) => {
      if (res.status == 200) {
        // this.getDetails(this.reviewType);
      }
      // this.getDetails(this.reviewType);
    })
  }

  dislikeComment(review, i) {
    if(!this.loginData){
      const modal = this.NgbDialogService.open(LoginPopupComponent,{
        centered : true
      })
      return;
    }
    let data =
    {
      "review_id": review._id,
      "dislike": {
        "customerId": this.loginData.result._id
      }
    }
    // new code (20 lines)
    let likeArr = this.ratingDetails.result[i].like;
    let dislikeArr = this.ratingDetails.result[i].dislike;
    const findLikeIndex = likeArr.findIndex((el) => el.customerId == this.loginData.result._id);
    const findDisLikeIndex = dislikeArr.findIndex((el) => el.customerId == this.loginData.result._id);
    if(findDisLikeIndex >= 0) {
      this.ratingDetails.result[i].dislike.splice(findDisLikeIndex, 1);
    } else {
      this.ratingDetails.result[i].dislike.push({customerId: this.loginData.result._id});
    }
    if(findLikeIndex >= 0) {
      this.ratingDetails.result[i].like.splice(findLikeIndex, 1);
    }
    this.httpService.post(`reviewComment`, data).subscribe(
      (res) => {
        console.log("res", res);
      },
      (err) => {
        console.log("err", err);
      }
    )
    return;
    // old code (77 lines)
    if(this.ratingDetails.result.length){
      this.ratingDetails.result.forEach(element => {
        if(element._id == review._id){
        if(element.dislike.length){
          let data : any = [];
           data = element.dislike;
          element.dislike.forEach(ele => {
            var newThis = this;
            const index = _.findIndex(data, function (i) {
              return (
                ele.customerId._id == newThis.loginData.result._id
              );
            });
            if(index == -1){
              element.dislike.push({
                customerId : {_id : this.loginData.result._id}
              })
              if(element.like.length){
                let newData : any = [];
                newData = element.like;
                element.like.forEach(ele => {
                  var newThis = this;
                  const index = _.findIndex(newData, function (i) {
                    return (
                      ele.customerId._id == newThis.loginData.result._id
                    );
                  });
                  if(index === -1){
                    // element.like.push({
                    //   customerId : {_id : this.loginData.result._id}
                    // })
                  }else {
                    element.like = element.like.splice(index,1);
                  }
                });
              }
            }else {
              element.dislike = element.dislike.filter((item)=>{item.customerId._id != this.loginData.result._id}); 
            }
          });
  
        }else{
          element.dislike.push({
            customerId : {_id : this.loginData.result._id}
          }) 
          if(element.like.length){
            let newData : any = [];
            newData = element.like;
            element.like.forEach(ele => {
              var newThis = this;
              const index = _.findIndex(newData, function (i) {
                return (
                  ele.customerId._id == newThis.loginData.result._id
                );
              });
              if(index === -1){
                // element.like.push({
                //   customerId : {_id : this.loginData.result._id}
                // })
              }else {
                element.like = element.like.filter((item)=>{item.customerId._id != this.loginData.result._id}); 
                // element.dislike.pop();
              }
            });
          }
        }
  
        // if(element.like.length == 0){
        //   element.like.push({
        //     customerId : {_id : this.loginData.result._id}
        //   })
        // }
      }
      });
    }
    this.httpService.post(`reviewComment`, data).subscribe((res: any) => {
      // this.getDetails(this.reviewType);
    })
  }

  checkLikeDislike(d: any, type?:any){
    if(!this.loginData)
    return;
    
    switch (type) {
      case 'like':
        if(d.like.length != 0) {
          let obj = d.like.find(x => x.customerId == this.loginData.result._id);
          if(obj) {
            return true;
          }
        }
        break;
      case 'dislike':
        if(d.dislike.length != 0) {
          let obj = d.dislike.find(x => x.customerId == this.loginData.result._id);
          if(obj) {
            return true;
          }
        }
        break;
      default:
        return '';
    }
  }

  onPageChange() {
    this.getDetails(this.reviewType, this.page);

    // Scroll back up to top
    let scrollY: number;
    if (this.isMobile) {
      scrollY = 300;
    } else {
      scrollY = 800;
    }
    window.scrollTo({
      top: scrollY,
      behavior: "smooth"
    });
  }

  getDetails(type: string, page: number = 1){
    let urlBuilder = new GetRatingsURLBuilder();
    var URL;
    this.reviewType = type;
    this.page = page;

    urlBuilder.reviewType(type).currPage(page).searchKeyword(this.searchKeyword);

    if(this.therapistId || this.locationId) {
      if(this.therapistId) {
        // URL = 'staff_review';
        // ID = this.therapistId;
        urlBuilder.api('staff_review').id(this.therapistId);
      } else if (this.locationId) {
        // URL = 'shop_review';
        // ID = this.locationId;
        urlBuilder.api('shop_review').id(this.locationId);
      }

      if (this.starFilter.isSet) {
        urlBuilder.starFilter(this.starFilter.filter);
      }

      URL = urlBuilder.done();
      this.httpService.get(URL).subscribe(res => {
        this.ratingDetails = res;
        if(this.shopWall) {
          this.reviews = res.result.slice(0, 2);
        } else {
          this.reviews = res.result;
        }
        this.totalReviews = res.result_pageInfo.collectionSize
        if(this.ratingDetails) {
          if(this.ratingDetails?.staff_overall && this.ratingDetails?.staff_overall[0] && this.ratingDetails?.staff_overall[0].rating) {
            this.overallRating = this.ratingDetails?.staff_overall[0].rating;
            console.log(this.overallRating);
          } else if (this.ratingDetails?.location_overall && this.ratingDetails?.location_overall[0] && this.ratingDetails?.location_overall[0].rating) {
            this.overallRating = this.ratingDetails?.location_overall[0].rating;
            console.log(this.overallRating);
          }
          if(this.overallRating && this.overallRating.stars) {
            this.overallRating.star_count = this.overallRating.stars.five_star_count + this.overallRating.stars.four_star_count + this.overallRating.stars.three_star_count + this.overallRating.stars.two_star_count + this.overallRating.stars.one_star_count
            this.percentRatings = {
              five_star: ((this.overallRating.stars.five_star_count * 100) / this.overallRating.star_count).toFixed(1),
              four_star: ((this.overallRating.stars.four_star_count * 100)/ this.overallRating.star_count).toFixed(1),
              three_star: ((this.overallRating.stars.three_star_count * 100)/ this.overallRating.star_count).toFixed(1),
              two_star: ((this.overallRating.stars.two_star_count * 100)/ this.overallRating.star_count).toFixed(1),
              one_star: ((this.overallRating.stars.one_star_count * 100)/ this.overallRating.star_count).toFixed(1)
            }
          }
        }
        this.isLoading = false;
                
      }, err => {
        this.isLoading = false;
      })
    }
  }

  setDefaultUserPic(e: any, gender: string, review) {
    if (review && review.anonymous){
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

  openScrollableContent(review:any) {
    // moment(review?.createdAt).fromNow()
    this.router.navigateByUrl('/comment/' + review._id);
    this.homeService.sendCommentData(review);
    // const openLocationRef = this.NgbDialogService.open(CommentComponent, { scrollable: true });
    // openLocationRef.componentInstance.name = 'Comments';
    // openLocationRef.componentInstance.data = review;
    // openLocationRef.result.then(
    //   result => {
    //     this.getDetails(this.reviewType);
    //   },
    //   reason => {
    //     this.getDetails(this.reviewType);
    //   })
  }

  clearSearchTimeout() {
    clearTimeout(this.searchTimeout);
  }
   navigateToCheckout() {
    this.router.navigate(['/checkout']);
  }

  search() {
    if(this.searchTimeout) {
      this.clearSearchTimeout();
    }
    this.searchTimeout = setTimeout(() => {
      this.getDetails(this.reviewType);
      this.clearSearchTimeout();
    }, 500);
  }
  customerDetail(client:any){
    if(client.customerId){
      this.router.navigate(['/customer-detail/' + client.customerId._id]);
    }
  }

  unsetStarFilter() {
    if (this.starFilter.isSet) {
      this.starFilter.isSet = false;
      this.starFilter.filter = undefined;
    }
    this.getDetails(this.reviewType, 1);
  }

  setStarFilter(stars: number) {
    if (this.starFilter.filter === stars) {
      // Click bar twice to remove filter
      this.unsetStarFilter();
      return;
    }

    this.starFilter = {
      isSet: true,
      filter: stars
    }

    this.page = 1; // Return to page 1, but retain sorting
    this.getDetails(this.reviewType, 1);
  }

  home = false;
  userFirstTime() {
    let data = JSON.parse(localStorage.getItem('firstTimeData'));
    if (data) {
      if (data.reviews == false) {
        setTimeout(() => {
          this.home = true;
        }, 2000);
      } else {
        this.home = false;
      }
    }
  }
  gotIt(e) {
    this.home = false;
    let data = JSON.parse(localStorage.getItem('firstTimeData'));
    data.reviews = true;
    localStorage.setItem("firstTimeData", JSON.stringify(data));
  }
  
}

class GetRatingsURLBuilder {
  private _url: string = "";

  private _api: string;
  private _id: string;
  private _reviewType: string;
  private _searchKeyword: string;
  private _currPage: number;
  private _starFilter: number;

  api(api: string): GetRatingsURLBuilder {
    this._api = api;
    return this;
  }

  id(id: string): GetRatingsURLBuilder {
    this._id = id;
    return this;
  }

  reviewType(type: string): GetRatingsURLBuilder {
    this._reviewType = type;
    return this;
  }

  searchKeyword(keyword: string): GetRatingsURLBuilder {
    if (keyword.length) {
      this._searchKeyword = keyword;
    }
    return this;
  }

  currPage(page: number): GetRatingsURLBuilder {
    this._currPage = page;
    return this;
  }

  starFilter(star: number): GetRatingsURLBuilder {
    this._starFilter = star;
    return this;
  }

  done(): string {
    if(!this._currPage) {
      this._currPage = 1;
    }

    if (this._api && this._reviewType && this._id) {
      this._url = `${this._api}/${this._id}?${this._reviewType}=true&currPage=${this._currPage}`;

      if (this._searchKeyword) {
        this._url = this._url.concat(`&searchKeyword=${this._searchKeyword}`);
      }

      if (this._starFilter) {
        this._url = this._url.concat(`&starFilter=${this._starFilter}`);
      }

      return this._url;
    } else {
      throw Error("Can't build URL. API, id, and reviewType required");
    }
  }
}
interface IStarFilter {
  isSet: boolean,
  filter?: number | undefined,
}