import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { City } from 'country-state-city';
import { LocationService } from 'src/app/services/location.service';

import { GetCurrentLocationComponent } from '../get-current-location/get-current-location.component';
@Component({
  selector: 'app-location-selection-popup',
  templateUrl: './location-selection-popup.component.html',
  styleUrls: ['./location-selection-popup.component.scss']
})
export class LocationSelectionPopupComponent implements OnInit {
  @Input() public userLocation;
  @Output() newLocation: EventEmitter<any> = new EventEmitter();
  constructor(
    private _modal:NgbModal,
    public activeModal: NgbActiveModal,
    private locationService: LocationService
    ) { }
  locations: any;
  location = null;
  userIP: any;
  ngOnInit(): void {
    this.getUserLocation()
  }

  getUserLocation() {
    this.locationService.addressLookUp()
    .subscribe(res => {
      this.getCitiesOfCountry(res['country_code'])
      this.userLocation = res;
    })
  }
  ngOnDestroy() {
  }
  closeModel() {
    this._modal.dismissAll();
  }
  getCitiesOfCountry(countryCode) {
    this.locations = City.getCitiesOfCountry(countryCode);
  }
  
  selected = null
  selectLocation(e) {
    console.log(e);
    let latPosition = e && e.geo_location ? e.geo_location.coordinates[1] : e.geometry.location.lat;
    let logPosition = e && e.geo_location ? e.geo_location.coordinates[0] : e.geometry.location.lng;
    let address_obj = {
      "name": e.locality || e.sublocality_level_5,
      "country": e.country,
      "countryCode": e.country_short,
      "latitude": latPosition,
      "longitude": logPosition
    }
    this.selected = address_obj;
    this.location = `${address_obj.name}, ${address_obj.countryCode}`;
    this.userLocation = address_obj;
  }
  updateLocation() {
    if (this.selected != null) {
      this.userLocation.selectedSpecificLocation = true;
      this.activeModal.close(this.userLocation);
      this.locationService.setUserLocation(this.userLocation);
    }
  }
  use_current() {
    this._modal.dismissAll();
    this._modal.open(GetCurrentLocationComponent, {centered:true})
  }
}
