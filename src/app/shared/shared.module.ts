import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ClickedOutsideDirective } from '../directives/clicked-outside.directive';
import { SidenavModule } from './sidenav/sidenav.module';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { CreditCardComponent } from 'src/app/main/mywallet/credit-card/credit-card.component';
import { StarRatingComponent } from 'src/app/shared/star-rating/star-rating.component';
import { ProductComponent } from '../main/product/product.component';
import { CustomToasterComponent } from './custom-toaster/custom-toaster.component';
import { CustomSpinnerComponent } from './custom-spinner/custom-spinner.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { PipesModule } from '../pipes/pipes.module';
import { CameraComponent } from './camera/camera.component';
import { LoaderComponent } from './loader/loader.component';
@NgModule({
    declarations: [
        SplashScreenComponent,
        CreditCardComponent,
        StarRatingComponent,
        ProductComponent,
        CustomToasterComponent,
        CustomSpinnerComponent,
        ChatboxComponent,
        ClickedOutsideDirective,
        CameraComponent,
        LoaderComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FooterModule,
        HeaderModule,
        SidenavModule,
        PickerModule,
        PipesModule,
    ],
    exports: [
        HeaderModule,
        SidenavModule,
        FooterModule,
        SplashScreenComponent,
        CreditCardComponent,
        StarRatingComponent,
        ProductComponent,
        CustomToasterComponent,
        CustomSpinnerComponent,
        ChatboxComponent,
        ClickedOutsideDirective,
        CameraComponent,
        LoaderComponent
    ]
})
export class SharedModule { }