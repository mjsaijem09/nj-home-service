import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RescheduleComponent } from './reschedule.component';

const route : Routes = [
  {
    path : 'reschedule',
    component : RescheduleComponent,
  },
  {
    path: 'reschedule',
    component: RescheduleComponent,
  },
  {
    path: 'edit',
    component: RescheduleComponent,
  },
  {
    path: 'rebook',
    component: RescheduleComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
  ]
})
export class RescheduleModule { }
