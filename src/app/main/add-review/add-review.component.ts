import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxStarsComponent } from 'ngx-stars';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { BookingService } from 'src/app/services/booking.service';
@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss'],
})
export class AddReviewComponent implements OnInit {
  ratingData: any;
  reviewCredentials: any;
 
  constructor(
    private cd: ChangeDetectorRef,
    private apiService: ApiServicesService,
    private _route: Router,
    private bookingService: BookingService,
    private activatedRoute: ActivatedRoute,
  ) { }
  @ViewChild('overall') overall! : NgxStarsComponent;
  @ViewChild('skill') skill! : NgxStarsComponent;
  @ViewChild('communication') communication! : NgxStarsComponent;
  @ViewChild('service') service! : NgxStarsComponent;
  @ViewChild('shoprate') shoprate! : NgxStarsComponent;
  currentRate = 3.4;
  valueHover = 0;
  redFlagCheck: boolean =false;
  anonymousCheck: boolean =false;
  reviewTheRapist: any
  reviewTheBusiness: any
  shopRatting: number = 0
  overAllRating: number = 0
  communicationRating: number  = 0
  skillsRating: number  = 0
  serviceRating: number  = 0;
  customerDetails: any;
  isOverAllRating : boolean = true;
  isSkillRating : boolean = true;
  isCommunicationRating : boolean = true;
  isServiceRating: boolean = true; 
  rebookLoader = false;
  paramObj: any;
  ratingId: any;
  isOnSubmitted = false;
  isSubmitted = false;
  fromMail = false;
  ngOnInit(): void {
    this.customerDetails = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
    this.reviewCredentials = JSON.parse( localStorage.getItem('reviewCredentials')!)
    this.activatedRoute.queryParams
      .subscribe(params => {
        
        if (params && params['therapistId']) {
          this.reviewCredentials = {};
          this.fromMail = true;
        this.reviewCredentials.therapistId = params['therapistId'];
        this.reviewCredentials.companyId = params['shopId'];
        }
      });

      if(this.fromMail){
        this.rebook();
      } else {
        this.checkReviewStatus('therapist');
        this.checkReviewStatus('company');
      }
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  selectedStar(e:any){
    console.log(e.srcElement.defaultValue);
  }
  onRatingSet(e: any) {
    console.log(e,
  this.shopRatting,
  this.overAllRating,
  this.communicationRating,
  this.skillsRating,
  this.serviceRating
    );
  }
  MassageRate(herbalMassageData:number){
    console.log(herbalMassageData);
  this.shopRatting = herbalMassageData
  this.cd.detectChanges();
  }
  overAllRate(overAllData:any){
    console.log(overAllData)
    this.isSkillRating = false;
    this.isCommunicationRating =false;
    this.isServiceRating = false;
    this.skillsRating = overAllData
    this.serviceRating = overAllData
    this.communicationRating = overAllData;
    this.overAllRating = overAllData
    // this.skill.rating =  overAllData;
    setTimeout(() => {
    this.isSkillRating = true;
    this.isCommunicationRating =true;
    this.isServiceRating = true;
    });
  }
  communicationRate(communicationData:any){
    console.log(communicationData);
    this.isSkillRating = true;
    this.communicationRating = communicationData;
    this.isOverAllRating = false;
    this.overAllRating = this.claculateOverAllRating()
    setTimeout(() => {
      this.isOverAllRating = true;
      });
  }
  skillsRate(skillsData:any){
    console.log(skillsData);
    this.skillsRating = skillsData;
    this.isOverAllRating = false;
    this.overAllRating = this.claculateOverAllRating()
    setTimeout(() => {
      this.isOverAllRating = true;
      });
  }
  serviceRate(serviceData:any){
    console.log(serviceData);
    this.serviceRating = serviceData;
    this.isOverAllRating = false;
    this.overAllRating = this.claculateOverAllRating()
    setTimeout(() => {
      this.isOverAllRating = true;
    });
  }

  claculateOverAllRating(){
    let overtAllValue =  this.skillsRating + this.serviceRating + this.communicationRating
    let overAllPercentage = overtAllValue / 3
    return overAllPercentage
  }
 
  submitReview() {
    let url ='review';
    let method ='post';
    if(this.shopRatting !== 0 && this.overAllRating === 0 ){
      this.ratingData = 
    {
      anonymous:!this.anonymousCheck,
      appointmentId:this.reviewCredentials.appointmentId,
      clientId: this.customerDetails.client, 
      companyId:this.reviewCredentials.companyId, 
      ratedTo:"company",
      star:this.shopRatting,
      review:this.reviewTheBusiness,
    } 
      if (this.ratingId) {
        this.ratingData.ratingId = this.ratingId
        url='update_rating';
        method='put'
      }
      this.apiService[method](url,this.ratingData).subscribe(res=>{
      console.log(res);
      this.isSubmitted = true;
      this.applyStyle();
     },error=>{
          console.log(error)
          this.isOnSubmitted=true;
          this.applyStyle();
        })
    }
    else if(this.overAllRating !== 0 && this.shopRatting === 0){
      this.ratingData = 
      {
        anonymous:!this.anonymousCheck,
        appointmentId:this.reviewCredentials.appointmentId,
        clientId: this.customerDetails.client,
        communication_star:this.communicationRating,
        companyId:this.reviewCredentials.companyId,
        massage_star:this.serviceRating,
        ratedTo:"therapist",
        redFlag:this.redFlagCheck,
        review:this.reviewTheRapist,
        skill_star:this.skillsRating,
        star:this.overAllRating,
        therapistId: this.reviewCredentials.therapistId
      }
      if (this.ratingId) {
        this.ratingData.ratingId = this.ratingId
        url = 'update_rating';
        method = 'put'
      }
      this.apiService[method](url, this.ratingData).subscribe(res => {
        console.log(res);
        this.isSubmitted = true;
        this.applyStyle();
       },error=>{
          console.log(error)
          this.isOnSubmitted=true;
          this.applyStyle();
        })
    }else if(this.overAllRating !== 0 && this.shopRatting !== 0){
        this.ratingData = 
        {
          anonymous:!this.anonymousCheck,
          appointmentId:this.reviewCredentials.appointmentId,
          clientId: this.customerDetails.client, 
          companyId:this.reviewCredentials.companyId,
          ratedTo:"company",
          star:this.shopRatting,
          review:this.reviewTheBusiness,
        } 
      if (this.ratingId) {
        this.ratingData.ratingId = this.ratingId
        url = 'update_rating';
        method = 'put'
      }
      this.apiService[method](url, this.ratingData).subscribe(res => {
          // this.isSubmitted = false;
        },(err:any)=>{
          // this.isOnSubmitted=false;
        })
          this.ratingData = 
          {
            anonymous:!this.anonymousCheck,
            appointmentId:this.reviewCredentials.appointmentId,
            clientId: this.customerDetails.client,
            communication_star:this.communicationRating,
            companyId:this.reviewCredentials.companyId,
            massage_star:this.serviceRating,
            ratedTo:"therapist",
            redFlag:this.redFlagCheck,
            review:this.reviewTheRapist,
            skill_star:this.skillsRating,
            star:this.overAllRating,
            therapistId: this.reviewCredentials.therapistId
          }
          if (this.ratingId) {
            this.ratingData.ratingId = this.ratingId
            url = 'update_rating';
            method = 'put'
          }
          this.apiService[method](url, this.ratingData).subscribe(res => {
            console.log(res);
            this.isSubmitted = true;
         this.applyStyle();
        },error=>{
          console.log(error)
          this.isOnSubmitted=true;
          this.applyStyle();
        })
   };
    }


  // submitReview() {
  //   this.ratingData = {
  //     anonymous: this.anonymousCheck,
  //     appointmentId: this.reviewCredentials.appointmentId,
  //     clientId: this.customerDetails.client,
  //     communication_star: this.communicationRating,
  //     // companyId:this.reviewCredentials.companyId,
  //     massage_star: this.serviceRating,
  //     ratedTo: 'appointment',
  //     redFlag: this.redFlagCheck,
  //     review: this.reviewTheRapist,
  //     skill_star: this.skillsRating,
  //     star: this.overAllRating,
  //     // therapistId: this.reviewCredentials.clientId
  //   }
  //   this.apiService.post('review', this.ratingData).subscribe(res=>{
  //     console.log(res);
  //     this.isSubmitted = false;
  //     this.applyStyle();
  //     }, error => {
  //       console.log(error)
  //       this.isOnSubmitted=false;
  //       this.applyStyle();
  //     })
  // }



  checkReviewStatus(type) {
//     {url}}/api/rating/already_rated


    const data = {
      "appointmentId": this.reviewCredentials.appointmentId,
      "companyId": this.reviewCredentials.companyId,
      "ratedTo": type,
      // "ratedTo": "appointment",
      "therapistId": this.reviewCredentials.therapistId,
      "clientId": this.customerDetails.client
    }
    this.apiService.post('already_rated', data).subscribe((res:any)=>{
      if (res.result && res.result.length > 0){
        let response = res.result[res.result.length - 1];
        if(type == 'therapist'){
          this.fillForm(response);
        } else {
          this.fillShopForm(response);
        }
        
      }
        
       },(err:any)=>{
      this.isOnSubmitted=true;
      this.applyStyle();
    })
  }


  fillForm(obj){
    this.ratingId = obj._id;
    this.anonymousCheck = !obj.anonymous;
    this.communicationRating = obj.communication_star;
    this.serviceRating = obj.massage_star;
    this.redFlagCheck = obj.redFlag;
    this.reviewTheRapist = obj.review;
    this.skillsRating = obj.skill_star;
    this.overAllRating = obj.star;
   
    this.skill.setRating(obj.skill_star);
    this.communication.setRating(obj.communication_star);
    this.service.setRating(obj.massage_star);
    this.overall.setRating(obj.star);
  }

  fillShopForm(obj){
    this.shopRatting = obj.star;
    this.reviewTheBusiness = obj.review;
    this.shoprate.setRating(obj.star);
  }

   applyStyle() {
     window.scroll(0,0);      
  }

  goBack(expression) {
    switch (expression) {
      case 'checkTherapist':
        this._route.navigate(['/therapist-detail',this.reviewCredentials.therapistId])
        break;
      case 'Rebook':
         this.rebook();
        break;
      case 'CheckShop':
        this._route.navigate(['/shops', this.reviewCredentials.companyId])
        break;
      case 'HomePage':
        this._route.navigate(['/'])
        break;
      default:
        this._route.navigate(['/schedule'])
    }
     
  }

  rebook(){
    this._route.navigate([`rebook?appointmentId=${this.reviewCredentials.appointmentId}`])
  }

  setDefaultTherapistPic(e: any, gender: string) {
    if(gender === 'Male') {
      e.target.src = './assets/images/male-therapist.svg';
    } else {
      e.target.src = './assets/images/female-therapist.svg';
    }
  }
   
}
