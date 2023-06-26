import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { YourLevelComponent } from './your-level.component';
import { SharedModule } from 'src/app/shared/shared.module';

const route : Routes = [
  {
    path : '',
    component : YourLevelComponent,
  },
];

@NgModule({
  declarations: [YourLevelComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    SharedModule
  ]
})
export class YourLevelModule { }
