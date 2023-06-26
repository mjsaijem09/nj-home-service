import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../authentication/login/login.component';
import { RegisterComponent } from '../authentication/register/register.component';
import { ForgotPasswordComponent } from '../authentication/forgot-password/forgot-password.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgOtpInputModule } from  'ng-otp-input';
import { VerifyPhoneComponent } from './verify-phone/verify-phone.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutofillRedirectionComponent } from './autofill-redirection/autofill-redirection.component';
import { NgbdModalContent } from './autofill-redirection/autofill-redirection.component';
import { AuthGuard } from '../guard/auth.guard';

const routes: Routes = [
    { path:'login', component:LoginComponent},
    { path:'forgot-password', component:ForgotPasswordComponent},
    { path:'register', component:RegisterComponent},
    { path: 'invite/:code',  component:RegisterComponent},
    { 
        path: 'verify-otp',
        canActivate: [AuthGuard],
        component:VerifyPhoneComponent
    },
    { 
        path: 'verify-email',
        canActivate: [AuthGuard],
        component:VerifyEmailComponent
    },
    { path: 'reset-password',component:ResetPasswordComponent},
    { path: 'generate-password',component:ResetPasswordComponent},
    { path: 'change-password',component:ChangePasswordComponent},
    { path: ':code', component:AutofillRedirectionComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full'},
]


@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        VerifyPhoneComponent,
        ResetPasswordComponent,
        VerifyEmailComponent,
        ChangePasswordComponent,
        AutofillRedirectionComponent,
        NgbdModalContent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild(routes),
        NgOtpInputModule,
        NgxIntlTelInputModule,
        NgbModule,
    ],
    exports: [
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent
    ]
})
export class AuthenticatonModule { }
