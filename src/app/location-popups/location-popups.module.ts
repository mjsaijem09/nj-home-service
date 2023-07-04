import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AskToChageLocationComponent } from './ask-to-chage-location/ask-to-chage-location.component';
import { LocationSelectionPopupComponent } from './location-selection-popup/location-selection-popup.component';
import { GetCurrentLocationComponent } from './get-current-location/get-current-location.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        AskToChageLocationComponent,
        LocationSelectionPopupComponent,
        GetCurrentLocationComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbModule,
        FormsModule,
        Ng2SearchPipeModule,
    ],
    exports: [
        AskToChageLocationComponent,
        LocationSelectionPopupComponent,
        GetCurrentLocationComponent,
    ]
})
export class LocationPopupsModule { }
