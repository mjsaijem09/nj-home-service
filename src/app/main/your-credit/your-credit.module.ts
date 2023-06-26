import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { YourCreditComponent } from './your-credit.component';

const route : Routes = [
  {
    path : '',
    component : YourCreditComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
  ]
})
export class YourCreditModule { }
