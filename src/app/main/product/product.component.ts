import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product;
  @Input() shop;
  currency = {name: 'USD', symbol: '$'};
  constructor(
    private router:Router,
  ) { }

  ngOnInit(): void {
    if(this.shop.currency) {
      this.currency = this.shop.currency;
    }
  }
  
  productProfile() {
    this.router.navigate(['product', this.product._id, this.shop.locationId]);
  }

  updateUrl(e: any) {
    e.target.src = './assets/images/product/default-product.svg';
  }
}
