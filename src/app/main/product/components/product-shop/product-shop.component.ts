import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-shop',
  templateUrl: './product-shop.component.html',
  styleUrls: ['./product-shop.component.scss']
})
export class ProductShopComponent implements OnInit {
  @Input() shop;

  constructor() { }

  ngOnInit(): void {
    console.log(this.shop);
  }

}
