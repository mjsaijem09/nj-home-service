import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { LikeComponent } from './like/like.component';
// import { NotificationsComponent } from './notifications/notifications.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentModule } from '../shared-components/shared-component.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeServiceService } from './home/home-service.service'
import { AddReviewComponent } from './add-review/add-review.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxStarsModule } from 'ngx-stars';
// import { RateAndReviewsComponent } from './rate-and-reviews/rate-and-reviews.component';
import { CommentsComponent } from './comments/comments.component';
import { CommentsModule } from './comments/comments.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ProfilePhotoComponent } from './my-profile/profile-photo/profile-photo.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { AuthGuard } from '../guard/auth.guard';
import { InviteFriendComponent } from './invite-friend/invite-friend.component';
import { MyPurchasesComponent } from './my-purchases/my-purchases.component';
// import { GiftcardModule } from 'src/app/main/giftcard/giftcard.module';
import { FeaturedShopsComponent } from './featured-shops/featured-shops.component';
import { MostBookedShopsComponent } from './most-booked-shops/most-booked-shops.component';
import { RecentlyViewedShopsComponent } from './recently-viewed-shops/recently-viewed-shops.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';
import { AddRelationComponent } from './add-relation/add-relation.component';
import { TherapistDetailComponent } from './therapist-detail/therapist-detail.component';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { RatingNReviewComponent } from './rating-n-review/rating-n-review.component';
import { TherapistRatingComponent } from './therapist-rating/therapist-rating.component';
import { CommentComponent } from './comment/comment.component';
import { ShopRatingComponent } from './shop-rating/shop-rating.component';
import { SearchCityComponent } from './search-city/search-city.component';
import { ContactComponent } from './contact/contact.component';
import { ContactCardComponent } from './contact/contact-card/contact-card.component';
import { ContactModalComponent } from './contact/contact-modal/contact-modal.component';
import { ShopDetailsComponent } from './shop-details/shop-details.component';
import { SearchShopComponent } from './search-shop/search-shop.component';
import { CategorySelectionComponent } from './category-selection/category-selection.component';
import { BookForComponent } from './book-for/book-for.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { CancellationComponent } from './cancellation/cancellation.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MyRequestComponent } from './my-request/my-request.component';
import { ShopSelectionComponent } from './shop-selection/shop-selection.component';
import { RecentViewComponent } from './recent-view/recent-view.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { ServiceSelectionComponent } from './service-selection/service-selection.component';
import { SelectTimeComponent } from './select-time/select-time.component';
import { SelectServiceComponent } from './select-service/select-service.component';
import { SendRequestComponent } from './send-request/send-request.component';
import { PaymentComponent } from './payment/payment.component';
import { OnlinePaymentComponent } from './online-payment/online-payment.component';
import { CustomerLevelComponent } from './customer-level/customer-level.component';
import { PickTherapistComponent } from './pick-therapist/pick-therapist.component';
import { DesktopModalComponent } from './desktop-modal/desktop-modal.component';
import { ConfirmBookingComponent } from './confirm-booking/confirm-booking.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AppointmentSuccessPopupComponent } from './checkout/appointment-success-popup/appointment-success-popup.component';
import { PaymentSuccessPopupComponent } from './checkout/payment-success-popup/payment-success-popup.component';
import { MainComponent } from './main.component';
import { OnlineShopModule } from './online-shop/online-shop.module';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { FreelanceListComponent } from './components/freelance-list/freelance-list.component';
import { FilterComponent } from './filter/filter.component';
import { FreelanceCardComponent } from './components/freelance-card/freelance-card.component';
import { AddLocationComponent } from './add-location/add-location.component';

const route : Routes = [
  {
    path : '',
    loadChildren: ()=> import('./home/home.module').then(res=> res.HomeModule)
  },
  {
    path : 'like',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./like/like.module').then(res=>res.LikeModule)
  },
  {
    path : 'notifications',
    canActivate: [AuthGuard],
    loadChildren:()=> import('./notifications/notification.module').then(res=>res.NotificationModule)
  },
  {
    path : 'schedule',
    canActivate: [AuthGuard],
    loadChildren:()=> import('./schedule/schedule.module').then(res=> res.ScheduleModule)
  },
  {
    path : 'review',
    canActivate: [AuthGuard],
    loadChildren:()=> import('./add-review/add-review.module').then(res=> res.AddReviewModule)
  },
  {
    path : 'all-reviews',
    canActivate: [AuthGuard],
    loadChildren:()=> import('./rate-and-reviews/rate-and-reviews.module').then(res=> res.RateAndReviewsModule)
  },
  {
    path : 'comment',
    canActivate: [AuthGuard],
    loadChildren:()=> import('./comments/comments.module').then(res=> res.CommentsModule)
  },
  {
    path: 'shop',
    loadChildren:()=> import('./shop-detail/shop-detail.module').then(res=> res.ShopDetailModule),
  },
  {
    path: 'giftcard',
    loadChildren:()=> import('./giftcard/giftcard.module').then(res=> res.GiftcardModule),
  },
  {
    path: 'mywallet',
    loadChildren:()=> import('./mywallet/mywallet.module').then(res=> res.MywalletModule),
  },
  {
    path: 'level',
    loadChildren:()=> import('./your-level/your-level.module').then(res=> res.YourLevelModule),
  },
  {
    path: 'your-credit',
    loadChildren:()=> import('./your-credit/your-credit.module').then(res=> res.YourCreditModule),
  },
  {
    path: 'appointment',
    loadChildren:()=> import('./reschedule/reschedule.module').then(res=> res.RescheduleModule),
  },
  {
    path: 'sign-form',
    loadChildren:()=> import('./intake-form/intake-form.module').then(res=> res.IntakeFormModule),
  },
  {
    path: 'my-giftcards',
    loadChildren:()=> import('./my-giftcards/my-giftcards.module').then(res=> res.MyGiftcardsModule),
  },
  {
    path: 'product',
    loadChildren:()=> import('./product/product.module').then(res=> res.ProductModule),
  },
  {
    path : 'my-profile',
    canActivate: [AuthGuard],
    component : MyProfileComponent,
  },
  {
    path : 'my-profile/photo',
    canActivate: [AuthGuard],
    component: ProfilePhotoComponent,
  },
  {
    path : 'invite-friend',
    canActivate: [AuthGuard],
    component: InviteFriendComponent,
  },
  {
    path : 'my-purchases',
    canActivate: [AuthGuard],
    component: MyPurchasesComponent,
  },
  {
    path : 'featured-shops',
    component: FeaturedShopsComponent,
  },
  {
    path : 'most-booked-shops',
    component: MostBookedShopsComponent,
  },
  {
    path : 'recently-viewed-shops',
    component: RecentlyViewedShopsComponent,
  },
  {
    path: 'reviews/:therapist',
    component: TherapistRatingComponent,
  },
  {
    path: 'therapist-rating/:therapistId',
    component: TherapistRatingComponent,
  },
  {
    path: 'comment/:id',
    component: CommentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reviews',
    component: ShopRatingComponent,
  },
  {
    path: 'shop-rating/:locationId',
    component: ShopRatingComponent,
  },
  {
    path: 'search-city',
    component:SearchCityComponent 
  },
  {
    path: 'contacts',
    component: ContactComponent
  },
  {
    path: 'search-shop',
    component:SearchShopComponent 
  },
  {
    path: 'search',
    component: FilterComponent 
  },
  {
    path: 'add-location',
    component: AddLocationComponent 
  },
  {
    path: 'category/:categoryName/:categoryId',
    component: CategorySelectionComponent,
  },
  {
    path: 'book-for',
    component: BookForComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'book-appointment',
    component: BookAppointmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cancel/:clientId/:booking_reference',
    component: CancellationComponent,
  },
  {
    path: 'confirm_booking/:appointmentId',
    component: ConfirmationComponent,
  },
  {
    path: 'therapist-detail/:therapistId',
    component: TherapistDetailComponent,
  },
  {
    path: 'therapist/:therapist',
    component: TherapistDetailComponent,
  },
  {
    path: 'freelancer/:id',
    component: TherapistDetailComponent,
  },
  {
    path: 'my-request',
    component:MyRequestComponent
  },
  {
    path: 'select-shop/:ownerId',
    component: ShopSelectionComponent,
  },
  {
    path: 'locations',
    component: ShopSelectionComponent,
  },
  {
    path: 'recent',
    component:RecentViewComponent
  },
  {
    path: 'customer-detail/:id',
    component: CustomerDetailComponent,
  },
  {
    path: 'select-service',
    component: ServiceSelectionComponent,
  },
  {
    path: 'select-time',
    component: SelectTimeComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'service',
    component: SelectServiceComponent,
  },
  {
    path: 'booking',
    component: SelectServiceComponent,
  },
  {
    path: 'send-request',
    component: SendRequestComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'pay',
    component:PaymentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pay_online',
    component: OnlinePaymentComponent,
  },
  {
    path: 'customer-level',
    component: CustomerLevelComponent,
  },
  {
    path: 'pick-therapist/:locationId/:ownerId',
    component: PickTherapistComponent,
  },
  {
    path: 'confirm-booking',
    component: ConfirmBookingComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    ScheduleComponent,
    LikeComponent,
    // NotificationsComponent,
    AddReviewComponent,
    // RateAndReviewsComponent,
    CommentsComponent,
    MyProfileComponent,
    ProfilePhotoComponent,
    InviteFriendComponent,
    MyPurchasesComponent,
    FeaturedShopsComponent,
    MostBookedShopsComponent,
    RecentlyViewedShopsComponent,
    ShopDetailComponent,
    AddRelationComponent,
    TherapistDetailComponent,
    LoginPopupComponent,
    RatingNReviewComponent,
    TherapistRatingComponent,
    CommentComponent,
    ShopRatingComponent,
    SearchCityComponent,
    ContactComponent,
    ContactCardComponent,
    ContactModalComponent,
    ShopDetailsComponent,
    SearchShopComponent,
    CategorySelectionComponent,
    BookForComponent,
    BookAppointmentComponent,
    CancellationComponent,
    ConfirmationComponent,
    MyRequestComponent,
    ShopSelectionComponent,
    RecentViewComponent,
    CustomerDetailComponent,
    ServiceSelectionComponent,
    SelectTimeComponent,
    SelectServiceComponent,
    SendRequestComponent,
    PaymentComponent,
    OnlinePaymentComponent,
    CustomerLevelComponent,
    PickTherapistComponent,
    DesktopModalComponent,
    ConfirmBookingComponent,
    CheckoutComponent,
    AppointmentSuccessPopupComponent,
    PaymentSuccessPopupComponent,
    MainComponent,
    FreelanceListComponent,
    FilterComponent,
    FreelanceCardComponent,
    AddLocationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    SharedComponentModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxStarsModule,
    CommentsModule,
    CarouselModule,
    NgxIntlTelInputModule,
    ImageCropperModule,
    NgxSliderModule,
    SharedModule,
    PipesModule,
    OnlineShopModule
    // GiftcardModule
  ],
  exports: [
    HomeComponent,
    ScheduleComponent,
    LikeComponent,
    // NotificationsComponent,
    AddReviewComponent,
    // RateAndReviewsComponent,
    CommentsComponent,
  ],
  providers: [HomeServiceService, DatePipe]
})
export class MainModule { }
