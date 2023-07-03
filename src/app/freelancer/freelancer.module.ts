import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { MapComponent } from './components/map/map.component';
import { GetStartedComponent } from './components/get-started/get-started.component';
import { SharedComponentModule } from '../shared-components/shared-component.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileDisplayPictureComponent } from './components/profile-display-picture/profile-display-picture.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileDetailsSectionComponent } from './components/profile-details-section/profile-details-section.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewItemComponent } from './components/review-item/review-item.component';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { ServiceItemComponent } from './components/service-item/service-item.component';

const routes: Routes = [
  { path:'login', component:LoginComponent},
  { path:'register', component:RegisterComponent},
  { path:':id', component:ProfileComponent},
]

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    CategoryListComponent,
    MapComponent,
    GetStartedComponent,
    ProfileComponent,
    ProfileDisplayPictureComponent,
    ProfileDetailsSectionComponent,
    ReviewListComponent,
    ReviewItemComponent,
    ServiceListComponent,
    ServiceItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgbModule,
    SharedComponentModule,
    SharedModule
  ]
})
export class FreelancerModule { }
