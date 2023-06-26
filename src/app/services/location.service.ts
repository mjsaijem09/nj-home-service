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
}
