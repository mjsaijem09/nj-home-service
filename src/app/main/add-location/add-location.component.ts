import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';

import { LocationService } from 'src/app/services/location.service';
import { GetCurrentLocationComponent } from 'src/app/location-popups/get-current-location/get-current-location.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var google: any;

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  @ViewChild('distance') distance: ElementRef;
  map
  circle
  userLocation
  isDefaultRadius:boolean = true;
  constructor(
    private _modal: NgbModal,
    public _locate: Location,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private _locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.initMap();
  }

  handlePlaceSelect(selectedPlace: any) {
    // Use the selected place value as needed
    console.log(selectedPlace);
    const lng = selectedPlace.geo_location.coordinates[0];
    const lat = selectedPlace.geo_location.coordinates[1];
    const coordinates = {lng, lat};
    console.log(coordinates);
    this.map.setCenter(coordinates);
  }

  ngAfterViewInit() {
    this.distance.nativeElement.addEventListener('input', (event) => {
      this.onZoomChange(event.target.value);
      this.isDefaultRadius = false;
    });
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 9.5,
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: false,
      fullscreenControl: false,
      scrollwheel: false
    });
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("position: ", position);
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
    
          this.map.setCenter(this.userLocation);
          this.setLocation();
          // Replace the marker with a circle
          this.circle = new google.maps.Circle({
            center: this.userLocation,
            map: this.map,
            radius: 45000,
            strokeColor: '#8BC34A',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            fillColor: '#8BC34A',
            fillOpacity: 0.15
          });
          
          const centerMarker = new google.maps.Marker({
            position: this.circle.getCenter(),
            map: this.map,
            icon: {
              url: 'assets/nj/crosshair.png',
              anchor: new google.maps.Point(10, 10)
            }
          });
    
          google.maps.event.addDomListener(this.map.getDiv(), 'wheel', (event: WheelEvent) => {
            console.log('wheel: ', event);

            const zoom = this.map.getZoom();
        
            // This checks if the wheel was scrolled up or down
            if (event.deltaY < 0) {
                // Scrolled up, zoom in
                this.map.setZoom(zoom + 1);
            } else {
                // Scrolled down, zoom out
                this.map.setZoom(zoom - 1);
            }
            
            // Prevent the event from being processed by the browser (or Google Maps)
            event.preventDefault();
          });

          // Listen for changes to the circle's center
          google.maps.event.addListener(this.map, 'center_changed', () => {
            console.log('center_changed');
            const newCenter = this.map.getCenter();
            this.circle.setCenter(newCenter);
            centerMarker.setPosition(newCenter);
            this.setLocation();
          });

          google.maps.event.addListener(this.map, 'zoom_changed', () => {
            const zoom = this.map.getZoom();
            // this.circle.setCenter(this.userLocation);
            // centerMarker.setPosition(this.userLocation);
            // this.map.setCenter(this.userLocation);
            this.onZoomLevelChange(zoom);
            this.setLocation();
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

  private calculateRadius(km: number): number {
    // Google Maps uses meters for radius, so convert km to meters
    return km * 1000;
  }

  private mapRange(value: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  distanceInKM: Number = 45;
  onZoomChange(value) {
    const km = parseInt(value, 10); // Convert the value to integer
    this.distanceInKM = km;
    const radius = this.calculateRadius(km); // Convert km to radius
    const percentage = (km / 400) * 100; // Calculate the percentage of km relative to 400

    this.distance.nativeElement.style.background = `linear-gradient(to right, #8BC34A 0%, #8BC34A ${percentage}%, #acacac49 ${percentage}%, #acacac49 100%)`;

    console.log(`The value ${km} km is ${percentage}% of 400 km.`);
    console.log("radius: ",radius)
    this.circle.setRadius(radius);
    // Get the circle's bounds
    const circleBounds = this.circle.getBounds();
    const zoom = this.map.getZoom();

    // Fit the map to the circle's bounds
    // this.map.fitBounds(circleBounds);

    // Check if the circle bounds are fully visible on the map
    // if (!this.map.getBounds().contains(circleBounds)) {
    //   // Adjust the zoom level to zoom in or out by a specific amount
    //   const zoomDelta = 1; // The amount to adjust the zoom level

    //   if (this.map.getBounds().getNorthEast().lat() < circleBounds.getNorthEast().lat()) {
    //     // Zoom in
    //     this.map.setZoom(zoom + zoomDelta);
    //   } else {
    //     // Zoom out
    //     this.map.setZoom(zoom - zoomDelta);
    //   }
    // }
    this.setLocation();
  }

  onZoomLevelChange(zoom: number): void {
    console.log('onZoomLevelChange');
    // Scale the zoom level (6 to 15) to the slider value range (0 to 400)
    const km = Math.round(this.mapRange(zoom, 15, 6, 0, 400));
    const percentage = (km / 400) * 100; // Calculate the percentage of km relative to 400

    // Update the slider value
    // this.distance.nativeElement.value = km;
    // this.distance.nativeElement.style.background = `linear-gradient(to right, #8BC34A 0%, #8BC34A ${percentage}%, #acacac49 ${percentage}%, #acacac49 100%)`;
    // Update the circle radius
    // const radius = this.calculateRadius(km);
    // this.circle.setRadius(radius);
  }

  distanceSetting(value: boolean) {
    if(value) {
      const newCenter = this.map.getCenter();
      this.map.setCenter(newCenter);
      this.circle.setCenter(newCenter);
  
      this.map.setZoom(9.5);
      this.circle.setRadius(45000);
      this.setLocation();
    }
  }

  locate() {
    this.map.setCenter(this.userLocation);
  }
   
  setLocation() {
    const mapCenter = this.map.getCenter();
    const obj = {
      coordinates: {lat: mapCenter.lat(), lng: mapCenter.lng()},
      distanceRadius: this.distanceInKM
    }
    this._locationService.set_location(obj);
  }

  apply() {
    this._locate.back();
  }
}
