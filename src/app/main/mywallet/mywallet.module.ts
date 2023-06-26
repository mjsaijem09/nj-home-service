import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MywalletComponent } from './mywallet.component';
import { LoyaltyPointsComponent } from './loyalty-points/loyalty-points.component';
import { CreditsComponent } from './credits/credits.component';
import { AddMoneyComponent } from './add-money/add-money.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
const route : Routes = [
  {
    path : '',
    component : MywalletComponent,
  },
];

@NgModule({
    declarations: [
        MywalletComponent,
        LoyaltyPointsComponent,
        CreditsComponent,
        AddMoneyComponent,
    ],
    imports: [
        RouterModule.forChild(route),
        CommonModule,
        FormsModule,
        SharedModule,
        PipesModule
    ],
    exports: [
        AddMoneyComponent,
    ]
})
export class MywalletModule { }
