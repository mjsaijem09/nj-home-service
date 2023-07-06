import { Component, OnInit } from '@angular/core';

import { ApiServicesService } from 'src/app/services/api-services.service';
import { LocationService } from 'src/app/services/location.service';
import { SearchService } from 'src/app/services/search.service';
@Component({
  selector: 'app-freelance-list',
  templateUrl: './freelance-list.component.html',
  styleUrls: ['./freelance-list.component.scss']
})
export class FreelanceListComponent implements OnInit {
  isLoading:boolean = false;
  location
  filterURL = 'therapist/search?';
  constructor(
    private _http: ApiServicesService,
    private _locationService: LocationService,
    private _search: SearchService
    ) { }

  ngOnInit(): void {
    this.location = JSON.parse(localStorage.getItem('location-radius'));
    this.initLocationParams();
    this.initList();
    this._search.getUserSearch().subscribe(
      (res: any) => {
        this.filterURL = 'therapist/search?';
        if (res.text) {
          this.updateQueryParam('search', res.text);
        }
        if (res.gender) {
          this.updateQueryParam('gender', res.gender);
        }
        if (res.sortBy) {
          this.updateQueryParam(res.sortBy, 'true');
        }
        if (res.category) {
          this.updateQueryParam('category', res.category);
        }
        this.initLocationParams();
        this.initList();
      }
    );
  }
  initLocationParams() {
    if (this.location.distanceRadius) {
      this.updateQueryParam('dis', this.location.distanceRadius.toString());
    }
    if (this.location.coordinates) {
      this.updateQueryParam('lat', this.location.coordinates.lat);
      this.updateQueryParam('long', this.location.coordinates.lng);
    }
  }
  private updateQueryParam(key: string, value: string): void {
    const params = new URLSearchParams(this.filterURL);
    if (params.has(key)) {
      params.delete(key);
    }
    params.append(key, value);
    const updatedFilterURL = params.toString();
    this.filterURL = decodeURIComponent(updatedFilterURL);

    // Remove leading `=&` if present after `/search?`
    this.filterURL = this.filterURL.replace(/\/search\?=&/, '/search?');
    console.log(this.filterURL);
  }

// therapist/search?category=5fc739a0f9632400073b6ea8&lat=10.315699&long=123.885437&nearest=true&dis=&search=jesvir&gender=male
  list = [];
  initList() {
    this.isLoading = true;
    this._http.get_nj(this.filterURL).subscribe(
      res => {
        console.log(res);
        this.list = res.result
        this.isLoading = false;
      },
      err => {
        console.log(err);
      }
    )
  }
  
}
