import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.scss']
})
export class ProductOverviewComponent implements OnInit {
  @Input() product;
  constructor() { }
  seeLess: boolean = true;
  ngOnInit(): void {
    console.log('Product', this.product);
  }

}
