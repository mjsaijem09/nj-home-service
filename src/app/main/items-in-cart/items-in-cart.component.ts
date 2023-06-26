import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart.service'
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';

@Component({
  selector: 'app-items-in-cart',
  templateUrl: './items-in-cart.component.html',
  styleUrls: ['./items-in-cart.component.scss']
})
export class ItemsInCartComponent implements OnInit {
  @Input() cartData;

  constructor(
    private router: Router,
    private cartService: CartService,
    private toast: ToasterService
    ) {
  }

  ngOnInit(): void {
    console.log(this.cartData);
  }
  
  removeToCart(e) {
    let newList = this.cartData.filter(item => {
      return item._id != e._id;
    })
    localStorage.setItem('cart', JSON.stringify(newList));
    this.initializeCartData(e)
  }
  initializeCartData(e?) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    this.cartService.setCartData(cart);
    this.toast.success(`Product ${e.name} has been removed from the cart`);
  }
  checkout() {
    this.router.navigate(['product/checkout'], { state: { checkoutData: this.cartData } });
  }
  viewCart() {
    this.router.navigate(['product/cart'], { state: { checkoutData: this.cartData } });
  }
  profile(id) {
    this.router.navigate(['product', id]);
  }
  totalForALLItems() {
    let itemPrice = 0;
    if(this.cartData != null) {
      this.cartData.forEach(obj => {
        itemPrice += obj.totalPrice;          
      });
    }
    return itemPrice;
  }
  setDefaultPic(e: any) {
    e.target.src = '/assets/images/product/img-thumbnail.jpg';
  }
}
