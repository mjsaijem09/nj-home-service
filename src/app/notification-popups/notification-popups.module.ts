import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyaltyPointsReceivedComponent } from './loyalty-points-received/loyalty-points-received.component';



@NgModule({
    declarations: [LoyaltyPointsReceivedComponent],
    imports: [
        CommonModule
    ],
    exports: [
        LoyaltyPointsReceivedComponent,
    ]
})
export class NotificationPopupsModule { }
