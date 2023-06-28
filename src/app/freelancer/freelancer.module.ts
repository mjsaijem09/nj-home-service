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
import { LoaderComponent } from './components/loader/loader.component';

const routes: Routes = [
  { path:'login', component:LoginComponent},
  { path:'register', component:RegisterComponent},
]

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    CategoryListComponent,
    MapComponent,
    GetStartedComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgbModule
  ]
})
export class FreelancerModule { }
