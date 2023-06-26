import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddReviewComponent } from '../add-review/add-review.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxStarsModule } from 'ngx-stars';

const route : Routes = [
  {
    path : '',
    component : AddReviewComponent,
  }

]

@NgModule({
  declarations: [],
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
export class AddReviewModule { }