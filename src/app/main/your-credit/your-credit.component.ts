import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-your-credit',
  templateUrl: './your-credit.component.html',
  styleUrls: ['./your-credit.component.scss']
})
export class YourCreditComponent implements OnInit {
  shiedList = []
  constructor(private apiService: ApiServicesService) { }

  ngOnInit(): void {
    this.getLevel();
  }
  getLevel() {
    const loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
    this.apiService.get('shield?clientId=' + loginData.client).subscribe((res: any) => {
      this.shiedList = res.result;
    }, err => { console.log(err) });
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

}
