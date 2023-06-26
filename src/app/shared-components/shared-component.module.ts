import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DynamicCardComponent } from './dynamic-card/dynamic-card.component';
import { SerachLocationComponent } from './serach-location/serach-location.component'
// import { GooglePlacesDirective } from '../directives/google-places.directive';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { LoyalitypointlistComponent } from './loyalitypointlist/loyalitypointlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonDatePickerComponent } from './common-date-picker/common-date-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeSlotSelectedComponent } from './time-slot-selected/time-slot-selected.component';
import { DeleteFevoriteTherapistComponent } from './delete-fevorite-therapist/delete-fevorite-therapist.component';
import { MassageControlComponent } from './massage-control/massage-control.component';
import { ShopComponent } from './shop/shop.component';
import { NgxStarsModule } from 'ngx-stars';

@NgModule({
  declarations: [
    DynamicCardComponent,
    SerachLocationComponent,
    // GooglePlacesDirective,
    EditProfileComponent,
    LoyalitypointlistComponent,
    CommonDatePickerComponent,
    TimeSlotSelectedComponent,
    DeleteFevoriteTherapistComponent,
    MassageControlComponent,
    ShopComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxStarsModule,
    Ng2SearchPipeModule
  ],
  exports: [
    DynamicCardComponent,
    SerachLocationComponent,
    CommonDatePickerComponent,
    TimeSlotSelectedComponent,
    DeleteFevoriteTherapistComponent,
    ShopComponent
  ]
})
export class SharedComponentModule { }
