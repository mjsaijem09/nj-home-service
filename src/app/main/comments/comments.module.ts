import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxStarsModule } from 'ngx-stars';
import { CommentsComponent } from './comments.component';

const route : Routes = [
  {
    path : 'comments-section',
    component : CommentsComponent,
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
export class CommentsModule { }
