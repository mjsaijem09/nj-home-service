import { Component, OnInit, Input } from '@angular/core';

import { ApiServicesService } from 'src/app/services/api-services.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-freelance-list',
  templateUrl: './freelance-list.component.html',
  styleUrls: ['./freelance-list.component.scss']
})
export class FreelanceListComponent implements OnInit {
  @Input() title: string;
  @Input() category: string;
  @Input() sort: string;
  isLoading:boolean = false;
  location

  constructor(
    private _http: ApiServicesService,
    private _locationService: LocationService
    ) { }

  ngOnInit(): void {
    console.log(this.title, this.category);
    this.location = JSON.parse(localStorage.getItem('location-radius'));
    this.initList();
    this._locationService.get_location().subscribe(
      res => {
        this.location = res;
        console.log(this.location);
      },
      err => {
        console.log(err);
      }
    )
  }

  list = [];
  initList() {
    this.isLoading = true;
    this._http.get_nj(`therapist`).subscribe(
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
