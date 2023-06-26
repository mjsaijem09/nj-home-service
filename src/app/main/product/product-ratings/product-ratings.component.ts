import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-product-ratings',
  templateUrl: './product-ratings.component.html',
  styleUrls: ['./product-ratings.component.scss']
})
export class ProductRatingsComponent implements OnInit {

  constructor(private _api: ApiServicesService) { }

  product

  ngOnInit(): void {
    this.initProductRatings();
  }
  initProductRatings() {
    let productId;
    productId = window.location.href.split("/");
    productId = productId[productId.length - 1];
    this._api.get(`products/${productId}`).subscribe(
      res => {
        this.product = res.result[0];
        console.log(this.product);
      },
      err => {
        console.log(err);
      }
    )
  }
}
