import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NotificatinService } from '../notifications/notification.service';

const route : Routes = [
  {
    path : '',
    component : NotificationsComponent,
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
  providers: [NotificatinService]
})
export class NotificationModule { }
