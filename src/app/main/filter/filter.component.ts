import { Component, OnInit } from '@angular/core';

import { ApiServicesService } from 'src/app/services/api-services.service';
import { LocationService } from 'src/app/services/location.service';
import { SearchService } from 'src/app/services/search.service';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  isLoading:boolean = false;
  location
  searchData:any = {};
  constructor(
    private _http: ApiServicesService,
    private _locationService: LocationService,
    private _search: SearchService
    ) { }

  ngOnInit(): void {
    this.location = JSON.parse(localStorage.getItem('location-radius'));
    this._locationService.get_location().subscribe(
      res => {
        this.location = res;
        console.log(this.location);
      },
      err => {
        console.log(err);
      }
    )
    this.initCategoryList();
  }

  categoryList = [];
  initCategoryList() {
    this.isLoading = true;
    this._http.get(`get_home_page?latt=${this.location.coordinates.lat}&long=${this.location.coordinates.lng}&dis=${this.location.distanceRadius}`).subscribe(
      (res) => {
        this.isLoading = false;
        console.log(res.category);
        res.category.forEach(element => {
          let item = {
            id: element._id,
            name: element.category[0].name,
            img: element.image,
          }
          this.categoryList.push(item);
        });
      },
      (err) => {
        this.isLoading = true;
        console.log(err);
      }
    );
  }

  search($event) {
    this.searchData[$event.target.name] = $event.target.value;
    this._search.setUserSearch(this.searchData);
  }

}
