import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CartService } from 'src/app/services/cart.service';
import { ViewPortService } from 'src/app/services/view-port.service'; 

@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.scss']
})
export class ProductCartComponent implements OnInit {
  public checkoutData: any = [];
  public smallDevice: any;
  constructor(private router: Router,private cartService: CartService, private viewPort: ViewPortService) {
    this.smallDevice = this.viewPort.smallDevice();
    this.checkoutData = JSON.parse(localStorage.getItem('cart'));
  }
  items: any = [];
  ngOnInit(): void {
    console.log(this.checkoutData);
    let shops = [];
    this.checkoutData.forEach(element => {
      console.log(element)
        shops.push(element.shop);
    });
    console.log(shops)
    let ids = shops.map(o => o.locationId)
    let newShopsArr = shops.filter(({locationId}, index) => !ids.includes(locationId, index + 1));
    console.log(newShopsArr);
    newShopsArr.forEach(shop => {
      shop.products=[]
      this.checkoutData.forEach(product => {
        if(product.locationId == shop.locationId) {
          shop.products.push(product);
        }
      });
      this.items.push(shop)
    });
  }
  increaseQty(e) {
    console.log(e);
    if(e.newStocks.stockQuantity > e.orderedQuantity) {
      e.orderedQuantity++;
      e.totalPrice = e.price * e.orderedQuantity;
    }
    var foundIndex = this.checkoutData.findIndex((obj => obj._id === e._id));
    this.checkoutData[foundIndex] = e;
    this.updateCartData();
  }
  decreaseQty(e) {
    console.log(e);
    if(e.orderedQuantity > 1) {
      e.orderedQuantity--;
      e.totalPrice = e.price * e.orderedQuantity;
    }
    var foundIndex = this.checkoutData.findIndex(obj => obj._id === e._id);
    this.checkoutData[foundIndex] = e;
    this.updateCartData();
  }
  removeToCart(e) {
    let product = this.checkoutData.indexOf(e._id);
    this.checkoutData.splice(product, 1);
    this.updateCartData();
  }
  updateCartData() {
    console.log(this.checkoutData);
    localStorage.setItem('cart', JSON.stringify(this.checkoutData));
    this.initializeCartData();
  }
  initializeCartData() {
    let cart = JSON.parse(localStorage.getItem('cart'));
    this.cartService.setCartData(cart);
  }
  totalForALLItems() {
    let itemPrice = 0;
    this.checkoutData.forEach(obj => {
      itemPrice += obj.totalPrice;          
    });
    return itemPrice;
  }
  productProfile(e) {
    console.log(e)
    this.router.navigate(['product', e._id], { state: { product: e, shop: e.shop } });
  }
  checkout() {
    this.router.navigate(['product/checkout'], { state: { checkoutData: this.checkoutData } });
  }
  setDefaultPic(e: any) {
    e.target.src = '/assets/images/product/img-thumbnail.jpg';
  }
}
