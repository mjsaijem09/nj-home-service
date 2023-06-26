import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from 'src/app/services/location.service';
@Component({
  selector: 'app-get-current-location',
  templateUrl: './get-current-location.component.html',
  styleUrls: ['./get-current-location.component.scss']
})
export class GetCurrentLocationComponent implements OnInit {
  userLocation:any;
  constructor(
    public activeModal: NgbActiveModal,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.locationService.addressLookUp()
    .subscribe(res => {
      this.userLocation = res
      console.log(res)
    })
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          let address_obj = {
              countryCode: this.userLocation.country,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              name: this.userLocation.city,
          };
          this.locationService.setUserLocation(address_obj);
          this.activeModal.close();
          localStorage.setItem('customerLatLongAddress', JSON.stringify({
            'latPosition': position.coords.latitude,
            'logPosition': position.coords.latitude,
            'address': this.userLocation.name
          }));
        } else {
          this.locationService.getUserLocation()
          .subscribe(res => {
            this.userLocation = {
              countryCode: res.countryCode,
              latitude: res.latitude,
              longitude: res.longitude,
              name: res.name,
            }
            this.locationService.setUserLocation(this.userLocation);
            this.activeModal.close();
          })
        }
      },
      (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

}
