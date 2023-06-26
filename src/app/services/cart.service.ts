import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartData = new BehaviorSubject<any>([]);

  constructor() {
    let cartData = JSON.parse(localStorage.getItem('cart'));
    this.setCartData(cartData)
  }
  setCartData(obj?: any) {
    this.cartData.next(obj);
  }
  refreshCart() {
    let cartData = JSON.parse(localStorage.getItem('cart'));
    this.cartData.next(cartData);
  }
  getCartData() {
    return this.cartData.asObservable();
  }
}
