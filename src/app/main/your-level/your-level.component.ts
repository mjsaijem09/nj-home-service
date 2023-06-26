import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-your-level',
  templateUrl: './your-level.component.html',
  styleUrls: ['./your-level.component.scss']
})
export class YourLevelComponent implements OnInit {

  constructor(private apiService: ApiServicesService) { }

  ngOnInit(): void {
    this.getLevel();
  }
  getLevel() {
    const loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
    const customerId = loginData?.result?._id;
    // this.apiService.get('get_profile/' + customerId).subscribe((res: any) => {
    //   const shops = res.result;
    // }, err => { console.log(err) });
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

}
