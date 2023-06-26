import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbOffcanvasConfig, NgbOffcanvas, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ApiServicesService } from "src/app/services/api-services.service";
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ViewPortService } from 'src/app/services/view-port.service'; 
import { CartService } from 'src/app/services/cart.service';
import { VariationOptionComponent } from '../variation-option/variation-option.component';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit {

  public checkoutForm:  UntypedFormGroup;
  public payment: string = 'Stripe';
  public amount:  any;
  public checkoutData: any = [];
  public items: any = [];
  public receiveOption = 'shipping';
  public orderItems = [];
  public itemsToCheckout: any = [];
  public smallDevice: any;
  public cartData;
  constructor(
    private router: Router, 
    private fb: UntypedFormBuilder, 
    private api: ApiServicesService,
    private toast: ToasterService,
    private viewPort: ViewPortService,
    private cartService: CartService,
    public modalService:NgbModal,
    private offcanvasService: NgbOffcanvas,
    public _offcanvasConfig: NgbOffcanvasConfig
  ) {
    this.smallDevice = this.viewPort.smallDevice();
    let extrasData = this.router.getCurrentNavigation().extras.state?.checkoutData;
    if (extrasData) {
      this.checkoutData = extrasData;
      console.log(this.checkoutData);
    } else {
      this.checkoutData = JSON.parse(localStorage.getItem('cart'));
    }
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      street: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    });
    console.log(this.checkoutData)
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
    this.itemsToCheckout = this.items[0];
    this.order(this.itemsToCheckout);
    console.log(this.items);
  }
  clientId: any;
  totalPrice: any;
  ngOnInit(): void {
    let clientData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
    if (!clientData) {
      console.log(clientData);
    } else {
      console.log(clientData);
      this.initializeClient(clientData)
    }
    this.cartData = JSON.parse(localStorage.getItem('cart'))
  };
  initializeClient(data) {
    this.checkoutForm.controls['firstName'].setValue(data.result.firstName);
    if(data.result.lastName) {
      this.checkoutForm.controls['lastName'].setValue(data.result.lastName);
    }
    if(data.result.mobile) {
      this.checkoutForm.controls['phone'].setValue(data.result.mobile);
    }
    if(data.result.email) {
      this.checkoutForm.controls['email'].setValue(data.result.email);
    }
    this.clientId = data?.client;
  }
  qtyDecrease(a, b){
    let currentQty = this.items[a].products[b].orderedQuantity;
    if (currentQty >= 2) {
      this.items[a].products[b].orderedQuantity--;
    }
    let price = this.items[a].products[b].price;
    this.items[a].products[b].totalPrice = price * this.items[a].products[b].orderedQuantity;      
    this.total();
  }
  qtyIncrease(a, b){
    let currentQty = this.items[a].products[b].orderedQuantity;
    let stocks = this.items[a].products[b].newStocks.stockQuantity;
    if (currentQty < stocks) {
      this.items[a].products[b].orderedQuantity++;
    }
    let price = this.items[a].products[b].price;
    this.items[a].products[b].totalPrice = price * this.items[a].products[b].orderedQuantity;      
    this.total();
  }
  selectShopToCheckout(e) {
    this.itemsToCheckout = e;
    console.log(this.itemsToCheckout);
    this.order(e);
  }
  cardOutput(e) {
    console.log(e);
    if(e.message === 'Ok') {
      this.total();
    }
  }
  order(e) {
    let items = [];
    e.products.forEach(element => {
      let item = {
        "orderedQuantity": element.orderedQuantity,
        "supplyPrice": element.totalPrice,
        "productId": element._id,
        "receivedQuantity": 0,
        "productSupplier": element?.supplier?._id,
        "locationId": element.locationId
      }
      items.push(item)
    });
    this.orderItems = items;
    console.log(this.orderItems);
    this.total();
  }
  subTotal = 0;
  total() {
    let price = 0;
    this.itemsToCheckout.products.forEach(obj => {
      price += obj.totalPrice;          
    });
    this.subTotal = price;
    this.getProcessingFee(price);
  }
  submitted = false;
  totalWithProcessingFee = 0;
  stripeFee = 0;
  getProcessingFee(e) {
    this.api.get(`get_processing_fee?amount=${e}`).subscribe(
      res => {
        console.log(res);
        if(res.status == 200) {
          this.stripeFee = res.processingFee;
          this.totalWithProcessingFee = res.total_amount;
        } else {
          this.toast.error(res.message);
        }
      },
      err => {
        console.log(err);
        this.toast.error(err.message);
      }
    )
  }
  public modal;
  onSubmit(modal) {
    this.submitted = true;
    console.log(this.itemsToCheckout);
    if(this.checkoutForm.invalid) {
      this.toast.error('Form is incomplete or not valid');
    } else {
      if (this.stripeFee == 0) {
        this.toast.error('Cannot process payment. Please add Credit/Debit Card to continue.');
      } else {
        this.modal = this.modalService.open(modal, { size: 'sm', centered: true });
      }
    }
  }
  public submit_payment = false;
  public success_payment = false;
  postData() {
    this.submit_payment = true;
    let payload = {
      "clientId": this.clientId,
      "ownerId": this.itemsToCheckout.ownerid,
      "shippingAddress": this.checkoutForm.value,
      "BillingAddress": this.checkoutForm.value,
      "sourceLocation": this.itemsToCheckout.locationId,
      "orderItems": this.orderItems,
      "orderType": "purchase",
      "totalPrice": this.subTotal,
      "discountPrice": 0,
      "payment": [
        {
          "name": "stripe",
          "amount": this.totalWithProcessingFee,
          "currency": this.itemsToCheckout?.currency?.name.toLowerCase(),
        }
      ],
      "shippingType": this.receiveOption,
    }
    console.log(payload);
    this.api.post('order', payload).subscribe(
      res => {
        console.log(res);
        this.checkoutProduct(res.result)
      },
      err => {
        console.log(err);
        this.toast.error('Something went wrong. Please contanct the shop via phone or email.');
      }
    )
  }
  checkoutProduct(product) {
    const payload = {
      orderId: product._id,
      amount: this.totalWithProcessingFee,
      processingFee: this.stripeFee,
      currency: this.itemsToCheckout?.currency?.name.toLowerCase(),
      description: "Purchase product from BookUs Web App",
      metadata: { 
        // products: this.orderItems,
      }
    }
    this.api.post(`product_checkout?ownerId=${this.itemsToCheckout.ownerid}`, payload).subscribe(
      res => {
        console.log(res)
        this.productSales(product)
      },
      err => {
        console.log(err)
      }
    ) 
  };
  productSales(product) {
    console.log(product);
    let orderItems = []
    product.orderItems.forEach(elm => {
      let item = {
        _type: "Sale Item",
        amount: elm.supplyPrice,
        quantity: elm.orderedQuantity,
        product: elm.productId
      }
      orderItems.push(item)
    });
    const payload = {
      product: orderItems,
      totalAmount: this.subTotal,
      payment: [
        {
          name: "stripe",
          amount: this.totalWithProcessingFee
        }
      ],
      location: product.sourceLocation,
      category: "product",
      ownerId: product.ownerId
    }
    this.api.post(`sales`, payload).subscribe(
      res => {
        this.submit_payment = false;
        this.success_payment = true;
        console.log(res)
        this.removeToCart()
      },
      err => {
        console.log(err)
      }
    )
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  setDefaultPic(e: any) {
    e.target.src = '/assets/images/product/img-thumbnail.jpg';
  }
  removeToCart() {
    var foundIndex = this.checkoutData.findIndex((obj => obj.shop.locationId === this.itemsToCheckout.locationId));
    this.cartData.splice(foundIndex, this.itemsToCheckout.products.length);
    localStorage.setItem('cart', JSON.stringify(this.cartData));
    this.cartService.refreshCart();
  }
  navigate() {
    this.modal.close();
    this.router.navigate(['/my-purchases'])
  }

  defaultImg(e: any) {
    e.target.src = './assets/images/product/default-product.svg';
  }

  oselectVariation(product, index1, index2) {
    product.updateVariation = true;
    this._offcanvasConfig.position = 'bottom';
    this._offcanvasConfig.keyboard = false;
    this._offcanvasConfig.panelClass = 'h-auto'
    const offcanvasRef = this.offcanvasService.open(VariationOptionComponent, this._offcanvasConfig);
    offcanvasRef.componentInstance.product = product;
    offcanvasRef.componentInstance.dismissWithResult
      .subscribe((res) => {
        console.log(res);
        this.items[index1].products[index2].selectedVariation = res;
      });
  }
}
