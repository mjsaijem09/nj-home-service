import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { LocationService } from 'src/app/services/location.service';
import { GetCurrentLocationComponent } from 'src/app/location-popups/get-current-location/get-current-location.component';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [NgbActiveModal]
})

export class MapComponent implements OnInit {
  @Output() output: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  map
  userLocation
  marker
  constructor(
    private locationService: LocationService,
    private _modal:NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 19,
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: false,
      fullscreenControl: false
    });
  
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("position: ", position);
          // this.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.sendCoordinates();
          // Center the map to the user's location
          this.map.setCenter(this.userLocation);
  
          // Add a marker at the user's location
          console.log(this.userLocation);
          this.marker = new google.maps.Marker({
            position: this.map.getCenter(),
            map: this.map,
            title: 'Your Location',
            draggable: true // Set the marker as draggable
          });

          google.maps.event.addListener(this.marker, 'dragstart', (event) => {
            // Handle drag start event
          });
        
          google.maps.event.addListener(this.marker, 'drag', (event) => {
            // Handle drag event
            // this.marker.setPosition(this.map.getCenter());
          });
        
          google.maps.event.addListener(this.marker, 'dragend', (event) => {
            // Handle drag end event
            this.map.panTo(this.marker.getPosition());
            const draggedMarkerPosition = this.marker.getPosition();
            console.log('Marker new position:', draggedMarkerPosition.lat(), draggedMarkerPosition.lng());
            this.userLocation.lat = draggedMarkerPosition.lat();
            this.userLocation.lng = draggedMarkerPosition.lng();
            this.sendCoordinates();
          });
        },
        (error) => {
          console.log('Error getting user location:', error);
          this._modal.open(GetCurrentLocationComponent, {centered:true})
        }
      );
    } else {
      console.log('Geolocation not supported');
    }
  }
  sendCoordinates() {
    const coordinates = {lat: this.userLocation.lat, long: this.userLocation.lng}
    this.output.emit(coordinates);
  }

}
