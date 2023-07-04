import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient  } from '@angular/common/http';
declare var google: any;

@Injectable({
    providedIn: 'root'
})

export class LocationService {
    lat: number = 0;
    lng: number = 0;
    getAddress: any;
    currentLocation: any = {};
    assgin: any;
    locationStorage = new BehaviorSubject<any>(
        {
            countryCode: "AU",
            latitude: -32.0376667,
            longitude: 115.4010622,
            name: "Perth",
        }
    );
    locationRadius = new Subject;
    userSearch = new BehaviorSubject<any>('');
    currentCoordinates = new BehaviorSubject<any>({});
    headerTitle: any 
    constructor(private http:HttpClient) { }

    setUserSearch(obj?: any) {
        this.userSearch.next(obj);
    }

    getUserSearch() {
        return this.userSearch.asObservable();
    }
    setUserLocation(obj?: any) {
        this.locationStorage.next(obj);
    }
    getUserLocation() {
        return this.locationStorage.asObservable();
    }
    setCurrentCoordinates(obj?: any) {
        this.currentCoordinates.next(obj);
    }
    
    getCurrentCoordinates() {
        return this.currentCoordinates.asObservable();
    }
    addressLookUp() {
        return this.http.get(`https://ipapi.co/json`);
    }
    getIPAddress() {  
        return this.http.get("https://api.ipify.org/?format=json")
    }

    getLocation() {
        let selectedSpecificLocation = false;
        this.getUserLocation().subscribe((res) => {
            console.log("res: ",res);
            if(res.selectedSpecificLocation) {
                selectedSpecificLocation = res.selectedSpecificLocation;
            }
        });
        if(selectedSpecificLocation) {
            return;
        }
        this.addressLookUp().subscribe(res => {
            let userLocation = res;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        if (position) {
                            this.currentLocation = {
                                countryCode: userLocation['country'],
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                name: userLocation['city'],
                            };
                            this.setUserLocation(this.currentLocation);
                            localStorage.setItem('userLocation', JSON.stringify(this.currentLocation));
                        }
                    },
                    (error) => console.log(error)
                );
            } else {
              alert("Geolocation is not supported by this browser.");
            }
        })
        
    }

    // new
    set_location(map){
        // Get the center coordinates from the map
        // Create a LatLng object
        const coordinates = new google.maps.LatLng(map.coordinates.lat, map.coordinates.lng);
        // Create a geocoder object
        const geocoder = new google.maps.Geocoder();
        // Perform reverse geocoding
        geocoder.geocode({ location: coordinates }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results.length > 0) {
                    const address = results[0].address_components;
                    let province
                    let city
                    address.forEach(element => {
                        if (element.types.includes('locality')) {
                            province = element.long_name
                        }
                        if (element.types.includes('administrative_area_level_2')) {
                            city = element.long_name
                        }
                    });
                    const obj = {
                        location: {province, city},
                        distanceRadius: map.distanceRadius,
                        coordinates: {lat: coordinates.lat(), lng: coordinates.lng()}
                    }
                    this.locationRadius.next(obj);
                    localStorage.setItem('location-radius', JSON.stringify(obj));
                }
            } else {
                console.error('Reverse Geocoding failed due to: ' + status);
            }
        });
    }

    get_location() {
        return this.locationRadius.asObservable();
    }
}
