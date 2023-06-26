import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CountdownModule } from 'ngx-countdown';
import { FormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MinutePipePipe } from './minute-pipe.pipe';
import { NgxStarsModule } from 'ngx-stars';
import { RouterModule } from '@angular/router';
import { NotificationsComponent } from 'src/app/main/notifications/notifications.component';
import { ItemsInCartComponent } from 'src/app/main/items-in-cart/items-in-cart.component';

@NgModule({
    declarations: [HeaderComponent, MinutePipePipe, NotificationsComponent, ItemsInCartComponent],
    imports: [
        CommonModule,
        RouterModule,
        NgbModule,
        CountdownModule,
        FormsModule,
        NgxStarsModule,
        NgCircleProgressModule.forRoot({
            "radius": 60,
            "space": -10,
            "outerStrokeGradient": true,
            "outerStrokeWidth": 10,
            "outerStrokeColor": "#00aa20",
            "outerStrokeLinecap": "square",
            "outerStrokeGradientStopColor": "#00aa20",
            "innerStrokeColor": "#000",
            "innerStrokeWidth": 10,
            "title": "",
            "showSubtitle": false,
            "animateTitle": false,
            "animationDuration": 1000,
            "showUnits": false,
            "showBackground": false,
            "clockwise": true,
            "startFromZero": false,
            "titleFontSize": "50",
            "titleColor": "#ffffff",
            // "lazy": true
        }),
    ],
    exports: [
        HeaderComponent, NotificationsComponent, ItemsInCartComponent
    ]
})
export class HeaderModule { }
