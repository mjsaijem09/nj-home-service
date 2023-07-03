import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private _activeR: ActivatedRoute,
    private _http: ApiServicesService
    ) { }

    ngOnInit(): void {
      this._activeR.params.subscribe(params => {
        const id = params['id'];
        console.log(id);
        // Use the ID as needed
        this.initData(id);
      });
    }
    data
    initData(id) {
      this._http.get_nj(`therapist/${id}`).subscribe(
        res => {
          console.log(res);
          this.data = res.result;
        },
        err => {
          console.log(err);
        }
      )
    }
}
