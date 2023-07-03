import { Component, OnInit, Input } from '@angular/core';

import { ApiServicesService } from 'src/app/services/api-services.service';

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
  constructor(private _http: ApiServicesService) { }

  ngOnInit(): void {
    console.log(this.title, this.category);
    this.initList();
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
