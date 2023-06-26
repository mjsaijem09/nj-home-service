import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiServicesService } from 'src/app/services/api-services.service';
import { LocationService } from 'src/app/services/location.service';
import { ScheduleService } from '../schedule/schedule.service';
import { GetCurrentLocationComponent } from 'src/app/location-popups/get-current-location/get-current-location.component';
declare var google: any;
@Component({
  selector: 'app-search-city',
  templateUrl: './search-city.component.html',
  styleUrls: ['./search-city.component.scss']
})
export class SearchCityComponent implements OnInit, AfterViewInit {
  isLoading: boolean = false;
  autofocus = true;
  headerLocation = false;
  locationList:any = [];
  searchText = "";
  customerLogin:any;
  constructor(private scheduleservice: ScheduleService,private router: Router,
    private service: ApiServicesService, private location: Location, private activatedRoute: ActivatedRoute,
    private locationService: LocationService,
    private modalService: NgbModal,
    ) { }


  ngOnInit(): void {
    const locationList:any = localStorage.getItem('searchList');
    this.customerLogin = this.getCookie('customerLogin');
    if(this.customerLogin) {
      this.getLocationHistory()
    } else {
      this.locationList = JSON.parse(locationList) || []
    }
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.headerLocation = params['headerLocation'];
      });
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  ngAfterViewInit(): void {
  }

  setDefaultPic(e: any) {
    e.target.src = './assets/images/no_image.png';
  }

  getLocationHistory(){
  this.isLoading = true;
    this.service.get(`recent_search_list`).subscribe((res:any) => {
      this.locationList = res.result;
      this.isLoading = false;
    },(err:any) => {
      this.isLoading = false;
      console.log(err);
    })
  }

  viewshopDetails(data: any) {
    console.log(data)
    this.router.navigate(['/shop-details'], {
      queryParams: {
        locationId: data._id,
        ownerId: data.ownerId,
        shopName: data.name,
        categoryId: data.categoryId && data.categoryId[0]
      },
    });
  }

  setAddress(obj: any) {
    console.log("obj----------", obj);
    let latPosition = obj && obj.geo_location ? obj.geo_location.coordinates[1] : obj.geometry.location.lat;
    let logPosition = obj && obj.geo_location ? obj.geo_location.coordinates[0] : obj.geometry.location.lng;
    let address_obj = {
      "name": obj.locality || obj.sublocality_level_5,
      "country": obj.country,
      "countryCode": obj.country_short,
      "latitude": latPosition,
      "longitude": logPosition
    }
    if (this.headerLocation) {
      localStorage.setItem('customerLatLongAddress', JSON.stringify(address_obj));
    }
    this.locationService.setUserLocation(address_obj);
    const locationList:any = localStorage.getItem('searchList');
    this.locationList = locationList ? JSON.parse(locationList) : [];
    let dataObj = {
      city:'',
      state:'',
      country:'',
      zip:'',
      latt : latPosition,
      long : logPosition,
    };
    if (obj.locality)
      dataObj.city = obj.locality;

    if (obj.postal_code)
      dataObj.zip = obj.postal_code;

    if (obj.admin_area_l1)
      dataObj.state = obj.admin_area_l1;

    if (obj.country)
      dataObj.country = obj.country;

    if(this.customerLogin){
      this.saveLocation(dataObj);
    }
    this.locationList.push(dataObj);
    localStorage.setItem('searchList', JSON.stringify(this.locationList))
    console.log("this.locationList--", this.locationList)
     this.location.back();
  }

  saveLocation(data: any) {
    this.service.post(`recent_search_list`, data).subscribe((res:any) => {
      this.locationList = res.result;
    },(err:any) => {
      console.log(err);
    })
  }

  useCurrentLoc() {
    //  this.getGeoLocation();
    let getUserLocation = this.modalService.open(GetCurrentLocationComponent, {
      centered: true,
    });
    getUserLocation.result.then((result) => {
      console.log(result);
      this.locationService.setUserLocation(result);
      this.location.back();
    })
  }

  goLocation(obj: any) {
    console.log(obj);
    let selected_location = {
      countryCode: "",
      latitude: obj.latt,
      longitude: obj.long,
      name: obj.city
    }
    this.locationService.setUserLocation(selected_location);
    this.location.back();

    // if (this.headerLocation) {
    //   localStorage.setItem('customerLatLongAddress', JSON.stringify({
    //     'latPosition': obj.latt,
    //     'logPosition': obj.long,
    //     'address': obj.city || obj.state || obj.country
    //   }));
    // }
    //  this.locationService.setUserSelectionLocation({
    //   'latPosition' : obj.latt,
    //   'logPosition' : obj.long,
    //   'address': obj.city || obj.state || obj.country
    // });
   
    //  this.location.back();
  }

  getGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log(position)
          // this.apiloader.load().then(() => {
          var latlng = new google.maps.LatLng(lat, lng);
          // This is making the Geocode request
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({ 'latLng': latlng }, (results: any) => {
            console.log(results);
            if (results && results[0]) {
              const userLocation = this.getGeoCity(results[0]);
              localStorage.setItem('customerLocation', JSON.stringify(results[0]));
              this.locationService.setUserLocation({
                'latPosition': lat,
                'logPosition': lng,
                'address': userLocation
              });
              if (this.headerLocation) {
                localStorage.setItem('customerLatLongAddress', JSON.stringify({
                  'latPosition': lat,
                  'logPosition': lng,
                  'address': userLocation
                }));
              }
              this.locationService.setUserLocation({
                'latPosition': lat,
                'logPosition': lng,
                'address': userLocation
              });
              this.location.back();
            } else {
              console.log('Not found');
              this.location.back();
            }
          });
        }
      },
        (error: any) => {
          return console.log(error);
          this.location.back();
        });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getGeoCity(results: any) {
    console.log(results);
    if (!results) {
      return null;
    }
    if (!results.address_components) {
      return results.locality;
    }

    let matches = results.address_components.filter((address_component: any) =>
      ["locality", "colloquial_area", "country"].some(word => ~address_component.types.indexOf(word)))
    if (!matches || !matches.length) {
    } else {
      // if(matches.length == 2) {
      //   return matches[0].short_name + ' ' + matches[1].short_name;
      // } else {
      return matches[0].short_name;
      // }

    }
    return '';
  }

}
