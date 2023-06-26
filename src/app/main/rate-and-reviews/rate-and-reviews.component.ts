import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { RatereviewsService } from './ratereviews.service'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
@Component({
  selector: 'app-rate-and-reviews',
  templateUrl: './rate-and-reviews.component.html',
  styleUrls: ['./rate-and-reviews.component.scss']
})
export class RateAndReviewsComponent implements OnInit {
  isLoading: boolean = false;
  commentForm!: UntypedFormGroup
  submitted = false;
  public searchReviews: any = '';
  currentRate = 2.5;
  windowWidth: number;
  height: any;
  show: boolean | undefined;
  showComment: boolean | undefined;
  hideComment: boolean | undefined
  locationId: any;
  overallDetails: any = [];
  commentDetails: any = [];
  loginData: any;
  iconcolor: boolean = false;
  reviewId: any;
  commentlist: any = [];
  copyCommentlist: any = [];
  customerDetails: any = [];
  sortingReview: any = 'byId';
  moment:any = moment;
  reportReviewId: any;
  reportComment: any;
  showMore: boolean = false;
  commentReviewId: any;
  reviewCommentObj: any = {
    commentId: null,
    reviewId: null,
    body: null
  };

  @Input() shopDetail?: any;

  constructor(
    private commentservice: RatereviewsService,
    private active: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private NgbDialogService: NgbModal,
    private newToast:ToasterService,
    private apiService:ApiServicesService,
  )
  {
    this.windowWidth = window.innerWidth
    if (this.windowWidth <= 768) {
      this.height = '10px';
      this.show = false
    }
    else if (this.windowWidth > 769) {
      this.height = '30px';
      this.show = true
    }
    this.active.queryParams.subscribe(params => {
      this.locationId = params.locationId
    });
  }

  ngOnInit(): void {
    this.loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
    this.getCommentDetails()
    this.commentForm = this.formBuilder.group({
      body: ['', Validators.required],
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.commentForm.controls; }

  getCommentDetails() {
    this.commentservice.getcomment(this.locationId, this.sortingReview, this.searchReviews).subscribe((res: any) => {
      this.overallDetails = res.location_overall;
      this.commentDetails = res.result;
      this.commentlist = res.result;
      this.commentlist = this.commentlist.map((d: any) => {
        return { ...d, iscommentShow: false }
      })
      this.copyCommentlist = this.commentlist;
      this.setServiceListPagination();
      this.reviewId = res.result
      this.reviewId = this.reviewId.map((comment: any) => {
        return comment._id
      })
    })
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  //Like Comment
  likeComment(_id: any) {
    let data =
    {
      "review_id": _id,
      "like": {
        "customerId": this.loginData.result._id
      }
    }
    this.commentservice.likeComment(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.iconcolor = true
        this.getCommentDetails()
      }
      this.getCommentDetails()
    })
  }

  //Dislike Comment
  dislikeComment(_id: any) {
    let data =
    {
      "review_id": _id,
      "dislike": {
        "customerId": this.loginData.result._id
      }
    }
    this.commentservice.dislikeComment(data).subscribe((res: any) => {
      this.getCommentDetails()
    })
  }

  formatter = (result: string) => result.toUpperCase();

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  onSubmit(reviewId: string) {
    this.submitted = true
    let formdata = {
      "comment":
      {
        "body": this.commentForm.value.body,
        "customerId": this.loginData.result._id
      },
      "review_id": reviewId
    }
    // stop here if form is invalid
    if (this.commentForm.valid) {
      this.commentservice.comment(formdata).subscribe((res: any) => {
        this.commentReviewId = reviewId;
        this.getCommentDetails();
      })
    }
    this.commentForm.reset()
    this.submitted = false;
  }

  checkLikeDislike(d: any, type?:any){
    let reviewLikeId = _.map(d.like, 'customerId._id');
    let reviewDislikeId = _.map(d.dislike, 'customerId._id');

    switch (type) {
      case 'like':
        if (reviewLikeId.indexOf(this.loginData.result._id) >=0) {
          return 'like-dislike-icon';
        }
        break;
      case 'dislike':
        if (reviewDislikeId.indexOf(this.loginData.result._id) >=0) {
          return 'like-dislike-icon';
        }
        break;

      default:
        return '';
    }
  }

  likeDislikeComment(reviewId: any, commentId: any, type: any, event: any){
    let data = {
      "comment":{
        [type]:{
          "customerId": this.loginData.result._id
        }
      },
      "commentId": commentId,
      "review_id": reviewId
    }
    this.commentservice.dislikeComment(data).subscribe((res: any) => {
      let commentLikeDislike = event.target.parentElement;
      if (!event.target.classList.value.includes('like-dislike-icon')) {
        commentLikeDislike.parentElement.querySelector('.comment-dislike i').classList.remove("like-dislike-icon");
        commentLikeDislike.parentElement.querySelector('.comment-like i').classList.remove("like-dislike-icon");
        event.target.classList.add("like-dislike-icon");
      }else{
        event.target.classList.remove("like-dislike-icon");
      }

      if (type == 'like') {
        let dislikeComment = commentLikeDislike;
        dislikeComment.querySelector('span').innerText = res.CommentLikes;
        dislikeComment.parentElement.querySelector('.comment-dislike span').innerText = res.CommentDislikes;
      }else{
        let likeComment = commentLikeDislike;
        likeComment.querySelector('span').innerText = res.CommentDislikes;
        likeComment.parentElement.querySelector('.comment-like span').innerText = res.CommentLikes;
      }
    })
  }

  replyComment(comment: any, event: any){
    let textComment = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
    textComment.querySelector('input').value = '@' + comment.customerId.firstName + ' ' + comment.customerId.lastName + ' - ';
    textComment.querySelector('input').focus();
  }

  handleEvent(reportReviewId:any, content:any){
    this.reportReviewId = reportReviewId;
    this.NgbDialogService.open(content ,{ centered: true });
  }

  addReport(){
    let payload = {
      "clientId": this.loginData.client,
      "comment": this.reportComment,
      "ratingId": this.reportReviewId
    }
    this.commentservice.addReport(payload).subscribe((res: any) => {
      if (res.status == 200) {
        this.newToast.success('Your Report Added Successfully')
        this.closePopup();
      }else {
        this.newToast.success('Something went wrong')
      }
    });
  }

  setServiceListPagination(){
    if (this.commentlist.length > 0 && this.shopDetail) {
      if (!this.showMore) {
        this.commentlist = this.commentlist.slice(0, 3);
      } else {
        this.commentlist = this.copyCommentlist;
      }
    }
  }

  showMoreList(){
    this.showMore = !this.showMore;
    this.setServiceListPagination();
  }

  countOverollRating(rating: any, star: any){
    let totalRatings = rating.one_star_count + rating.two_star_count + rating.three_star_count + rating.four_star_count + rating.five_star_count;
    return star * 100 / totalRatings;
  }

  openPopup(content: any, commentId:any, reviewId: any, body?: any){
    this.reviewCommentObj = {
      commentId: commentId,
      reviewId: reviewId,
      body: body
    }
    this.NgbDialogService.open(content ,{ centered: true });
  }

  deleteReview(){
    const { commentId, reviewId } = this.reviewCommentObj;
    this.apiService.patch(`rating/delete_rating/${reviewId}?id=${commentId}`).subscribe((res: any) => {
      this.getCommentDetails();
      this.closePopup();
      this.commentReviewId = reviewId;
    });
  }
  
  editReview(){
    const { commentId, reviewId, body } = this.reviewCommentObj;
    let payload = {
      body: body
    }
    this.apiService.patch(`rating/update_rating/${reviewId}?id=${commentId}`, payload).subscribe((res: any) => {
      this.getCommentDetails();
      this.closePopup();
      this.commentReviewId = reviewId;
    });
  }

  closePopup(){
    this.NgbDialogService.dismissAll();
  }
}
