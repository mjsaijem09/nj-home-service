import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-featured-shops',
  templateUrl: './featured-shops.component.html',
  styleUrls: ['./featured-shops.component.scss']
})
export class FeaturedShopsComponent implements OnInit {
  shops:any = [];
  constructor(
    private router: Router,
  ) {
    let data = this.router.getCurrentNavigation().extras?.state?.data;
    if (data) {
      this.shops = data;
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    
  }
  goToShop(id) {
    this.router.navigate(['/shop', id], { state: { previous_url: '/' } });
  }
  setDefaultPic(e: any) {
    return e.target.src = './assets/images/no_image.png';
  }
  imgLink(e) {
    if(e === undefined || e === null) {
    } else {
      let splitLink = e.split("/");
      return `${environment.image_url}/uploads/${splitLink[splitLink.length - 1]}`;
    }
  }
  addressFormat(shop) {
    let address = '';
    if(shop.building && shop.building != '') {
      address = address+shop.building+', '
    }
    if(shop.street && shop.street != '') {
      address = address+shop.street+', '
    }
    if(shop.city && shop.city != '') {
      address = address+shop.city+', '
    }
    if(shop.state && shop.state != '') {
      address = address+shop.state+', '
    }
    if(shop.zip && shop.zip != '') {
      address = address+shop.zip
    }
    return address;
  }
}
