import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxStarsModule } from 'ngx-stars';
import { AsyncPipe } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwipeAngularListModule } from 'swipe-angular-list';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgxStripeModule } from 'ngx-stripe';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { InterceptorService } from './services/interceptor.service';
import { ApiServicesService } from './services/api-services.service';
import { AuthServiceService } from './services/auth-service.service';
import { GlobalValidationService } from './main/home/global-validation.service'
import { LandingComponent } from './landing/landing.component';
import { LocationPopupsModule } from './location-popups/location-popups.module';
import { NotificationService } from './services/notification.service';

import { ReportBugPopupComponent } from './report-bug-popup/report-bug-popup.component';
import { InviteFriendPopupComponent } from './invite-friend-popup/invite-friend-popup.component';
import { SuccessPopupComponent } from './report-bug-popup/success-popup/success-popup.component';
import { OnlineSupportPopupComponent } from './online-support-popup/online-support-popup.component';
import { NotificationPopupsModule } from './notification-popups/notification-popups.module';

import { register } from 'swiper/element/bundle';
register();

@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
        ReportBugPopupComponent,
        InviteFriendPopupComponent,
        SuccessPopupComponent,
        OnlineSupportPopupComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        // ServiceWorkerModule.register('ngsw-worker.js', { enabled: true}),
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaterialTimepickerModule,
        SharedModule,
        HttpClientModule,
        RouterModule,
        BrowserAnimationsModule,
        NgxStarsModule,
        HammerModule,
        SwipeAngularListModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        AngularFireMessagingModule,
        AngularFireDatabaseModule,
        AngularFireFunctionsModule,
        LocationPopupsModule,
        NotificationPopupsModule,
        CarouselModule,
        PickerModule,
        NgxStripeModule.forRoot('pk_test_VK47XeSEIbfr4iKhfmVHAtsr00cnZhNzel'),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
    ],
    exports: [SharedModule],
    providers: [
        ApiServicesService,
        NotificationService,
        GlobalValidationService,
        AsyncPipe,
        AuthServiceService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
