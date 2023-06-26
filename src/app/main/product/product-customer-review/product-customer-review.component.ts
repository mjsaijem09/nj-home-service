import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-customer-review',
  templateUrl: './product-customer-review.component.html',
  styleUrls: ['./product-customer-review.component.scss']
})
export class ProductCustomerReviewComponent implements OnInit {
  @Input() productData : any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.productData);
  }

}
