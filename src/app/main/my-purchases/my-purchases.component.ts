import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-my-purchases',
  templateUrl: './my-purchases.component.html',
  styleUrls: ['./my-purchases.component.scss']
})
export class MyPurchasesComponent implements OnInit {
  public tab = 'orders';
  constructor(private api: ApiServicesService, private router: Router) { }
  public client;
  public reload = true;
  ngOnInit(): void {
    this.client = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
    console.log(this.client)
    if (this.client != null) {
      this.initializeOrders();
    }
  }
  public orders: any = [];
  public completed: any = [];
  initializeOrders() {
    this.reload = false;
    this.api.get(`order?type=client&clientId=${this.client.client}`)
    .subscribe(res=> {
      let data = res.result;
      console.log(data);
      data.forEach(element => {
        if(!element.isOrderReceived) {
          this.orders.push(element);
        } else {
          this.completed.push(element);
        }
      });

      this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.completed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.reload = true;
    });
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  setDefaultPic(e: any) {
    e.target.src = '/assets/images/product/img-thumbnail.jpg';
  }
  orderTotal(e) {
    let total = 0;
    e.forEach(obj => {
      let itemPrice;
      if(obj.productId?.retailPrice) {
        itemPrice = obj.productId.retailPrice
      }
      if(obj.productId?.specialPrice) {
        itemPrice = obj.productId.specialPrice
      }
      total += itemPrice * obj.orderedQuantity;
    });
    return total;
  }
  orderReceived(data) {
    console.log(data)
    data.isOrderReceived = true;
    this.api.patch(`order/${data._id}`, data).subscribe(
      res => {
        console.log(res)
        this.initializeOrders();
      }
    )
  }
  addReview(data) {
    console.log(data);
    this.router.navigate([`product/rate-product/${data.orderItems[0].productId._id}`,], {queryParams: {data: JSON.stringify(data)}});
  }

  switchTab(tab) {
    this.tab = tab;
  }
}
