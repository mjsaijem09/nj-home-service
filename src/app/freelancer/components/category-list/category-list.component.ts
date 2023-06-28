import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ApiServicesService } from 'src/app/services/api-services.service';
import { LocationService } from 'src/app/services/location.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  @Output() output: EventEmitter<void> = new EventEmitter<void>();
  isLoading:boolean = false;
  userLocation = {
    countryCode: 'AU',
    latitude: -32.0376667,
    longitude: 115.4010622,
    name: 'Perth',
  };
  categoryList: any = [];
  constructor(
    private apiService: ApiServicesService,
    private locationService: LocationService,
  ) { }

  ngOnInit(): void {
    this.fetchLocation();
  }
  fetchLocation() {
    this.locationService.getUserLocation().subscribe((res) => {
      this.userLocation = {
        countryCode: res.countryCode,
        latitude: res.latitude,
        longitude: res.longitude,
        name: res.name,
      };
      this.initCategoryList();
    });
  }
  initCategoryList() {
    this.isLoading = false;
    this.apiService
      .get(
        `get_home_page?latt=${this.userLocation.latitude}6&long=${this.userLocation.longitude}&dis=50`
      )
      .subscribe(
        (res) => {
          this.isLoading = true;
          res.category.forEach(element => {
            let item = {
              id: element.category[0]._id,
              name: element.category[0].name,
              img: element.image,
              selected: false
            }
            this.categoryList.push(item);
          });
          console.log("categoryList: ", this.categoryList);
        },
        (err) => {
          this.isLoading = true;
          console.log(err);
        }
      );
  }
  
  selectCategory(category, i) {
    this.categoryList[i].selected = !category.selected;
    this.output.emit(this.categoryList);
  }

}
