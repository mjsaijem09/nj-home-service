import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() data;
  @Input() shop;
  
  percentDiscount
  originalPrice
  specialPrice
  constructor(
    private _router:Router,
  ) { }

  ngOnInit(): void {
    if(this.data) {
    console.log(this.data);
      // discount price
      let decimalNumber = ((this.data.retailPrice - this.data.specialPrice) / this.data.retailPrice) * 100;
      this.percentDiscount = Math.round(decimalNumber);
      // 
      this.originalPrice = this.shop.currency.symbol + this.data.retailPrice;
      //
      this.specialPrice = this.shop.currency.symbol + this.data.specialPrice;
    }
  }

  handleErrorImage(element) {
    element.target.src = 'assets/images/product/default-product.svg';
  }

  navigate() {
    this._router.navigate(['product', this.data._id, this.shop.locationId]);
  }
}
