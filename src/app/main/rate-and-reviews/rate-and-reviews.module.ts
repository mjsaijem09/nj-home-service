import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RateAndReviewsComponent } from '../rate-and-reviews/rate-and-reviews.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxStarsModule } from 'ngx-stars';

const route : Routes = [
  {
    path : '',
    component : RateAndReviewsComponent,
  }

]

@NgModule({
  declarations: [RateAndReviewsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxStarsModule

  ],
  exports : [
  ],
  providers:[]
  
})
export class RateAndReviewsModule { }
