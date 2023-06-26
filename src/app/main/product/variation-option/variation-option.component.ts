import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbOffcanvas, NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-variation-option',
  templateUrl: './variation-option.component.html',
  styleUrls: ['./variation-option.component.scss']
})
export class VariationOptionComponent implements OnInit {
  @Input() public product;
  @Output() dismissWithResult = new EventEmitter<any>();

	constructor(
    private offcanvasService: NgbOffcanvas,
    public activeOffcanvas: NgbActiveOffcanvas
    ) {}
  variant
  price
  currency
  quantity: number = 1;
  ngOnInit(): void {
    console.log(this.product);
    this.currency = this.product.shop.currency;
    if (this.product.specialPrice && this.product.specialPrice > 0) {
      this.price = this.product.specialPrice;
    } else {
      this.price = this.product.retailPrice;
    }
    if(this.product?.selectedVariation) {
      this.variant = this.product?.selectedVariation;
    }
  }
  
  selectVariation(e) {

    if (!this.variant) {
      this.variant = e;
    } else if (e._id === this.variant._id) {
      this.variant = null;
    } else {
      this.variant = e;
    }
  }
  changeQty(operation) {
    switch (operation) {
      case 'add':
        // if(this.quantity < this.variant.variationQuantity) {
          this.quantity++
        // }
        break;
      case 'minus':
          this.quantity--
        break;
      default:
        break;
    }
  }
  dismiss(action, data) {
    data.action = action;
    data.qty = this.quantity;
    this.dismissWithResult.emit(data);
    this.offcanvasService.dismiss(data);
  }
}
