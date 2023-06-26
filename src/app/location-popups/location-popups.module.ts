import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { GooglePlacesDirective } from 'src/app/directives/google-places.directive';
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
        GooglePlacesDirective
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
        GooglePlacesDirective
    ]
})
export class LocationPopupsModule { }
