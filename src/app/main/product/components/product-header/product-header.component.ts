import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-header',
  templateUrl: './product-header.component.html',
  styleUrls: ['./product-header.component.scss']
})
export class ProductHeaderComponent implements OnInit {
  @Input() product;
  cart: any = [];
  constructor(
    public location: Location,
    private cartService: CartService,
    private _route: Router
    ) {
      this.cartService.getCartData()
      .subscribe(res => {
        this.cart = res;
      })
    }

  ngOnInit(): void {
    console.log(this.scrolled)
  }
  scrolled = 0;
  @HostListener('window:scroll', ['$event']) onScroll() {
    this.scrolled = window.pageYOffset 
          || document.documentElement.scrollTop 
          || document.body.scrollTop || 0;
  }

  viewCart() {
    this._route.navigate(['product/cart'], { state: { checkoutData: this.cart } });
  }

}
