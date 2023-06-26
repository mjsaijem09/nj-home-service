import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduleComponent } from '../schedule/schedule.component';


const route : Routes = [
  {
    path : '',
    component : ScheduleComponent,
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule
  ],
  exports : [
  ],
  providers:[]
})
export class ScheduleModule { }
