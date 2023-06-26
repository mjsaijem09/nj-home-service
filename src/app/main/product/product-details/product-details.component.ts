import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { NgbModal, NgbModalConfig, NgbOffcanvasConfig, NgbOffcanvas, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { CartService } from 'src/app/services/cart.service';
import { ViewPortService } from 'src/app/services/view-port.service'; 
import { ApiServicesService } from 'src/app/services/api-services.service';
import { LocationOptionComponent } from './location-option/location-option.component';
import { VariationOptionComponent } from '../variation-option/variation-option.component';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [NgbOffcanvasConfig, NgbOffcanvas],
})

export class ProductDetailsComponent implements OnInit {
  product: any;
  shop: any;
  currency: string;
  productCover: string;
  productImages: OwlOptions = {
    loop: false,
    autoplay: false,
    center: false,
    autoHeight: true,
    autoWidth: true,
    nav: false,
    dots: false,
    items: 1,
    margin: 0,
    navText: [
       "<i class='fa fa-chevron-left'></i>",
       "<i class='fa fa-chevron-right'></i>"
    ],
  };
  variationImages: OwlOptions = {
    loop: false,
    autoplay: false,
    center: false,
    autoHeight: true,
    autoWidth: true,
    nav: false,
    dots: false,
    items: 4.5,
    margin: 0,
    navText: [
       "<i class='fa fa-chevron-left'></i>",
       "<i class='fa fa-chevron-right'></i>"
    ],
  };
  cart: any = [];
  addedToCard: boolean = false;
  smallDevice: any;
  locationId: any = null;
  productId: any = null;
  today = new Date().toLocaleDateString();
  deliveryDate = '';
  productPrice
  constructor(
    config: NgbModalConfig,
    private router: Router,
    private _activeR: ActivatedRoute,
    private cartService: CartService,
    private viewPort: ViewPortService,
    private _api: ApiServicesService,
    private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas,
    public _offcanvasConfig: NgbOffcanvasConfig
    ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.smallDevice = this.viewPort.smallDevice();
    _offcanvasConfig.position = 'bottom';
		// _offcanvasConfig.backdropClass = 'bg-info';
		_offcanvasConfig.keyboard = false;
		_offcanvasConfig.panelClass = 'h-auto'
    // windowClass : "_contact"
  }
  productSlide = [];
  variationSlide = [];
  ngOnInit(): void {
    this._activeR.params.subscribe(params => {
      this.productId = params['product_id'];
      this.locationId = params['location_id'];
      // Use the IDs as needed
    });
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()+2);
    this.deliveryDate = date;
    this.getProductData();
    this.getShopData();
  }

  getProductData() {
    this._api.get(`products/${this.productId}`).subscribe(
      res => {
        this.product = res.result[0];
        console.log("this.product: ",this.product);
        this.productCover = this.product?.productImages[0]?.productImage;
        this.initPrice();
        this.getStrocks();

        this.product.productImages.forEach(element => {
          let slide = {
            img: element.productImage,
            id: element._id,
            name: 'featured',
            type: 'featured'
          }
          this.productSlide.push(slide);
        })
        this.product.variations.forEach(element => {
          if(element.variationPicture) {
            let slide = {
              img: element.productImage,
              id: element._id,
              name: element.variationName,
              type: 'variation'
            }
            this.productSlide.push(slide);
            this.variationSlide.push(slide);
          }
        });
        console.log("this.productSlide: ", this.productSlide);
      },
      err => {
        console.log(err);
      }
    )
  }
  getShopData() {
    this._api.get(`get_shop_detail?locationId=${this.locationId}&detail=true`).subscribe(
      res => {
        this.shop = res.result;
        this.currency = this.shop.currency.symbol;
        this.product.ownerId = this.shop.ownerid;
        this.product.locationId = this.locationId;
        this.product.shop = this.shop;
        this.product.shop.locationId = this.locationId;
        console.log("this.product: ", this.product);
        this.initializeCartData();
      },
      err => {
        console.log(err);
      }
    )
  }
  productStocks
  getStrocks() {
    this.product.stocks.locationStockList.forEach(element => {
      if(element.location._id === this.locationId) {
        this.productStocks = element;
        if(this.productStocks.stockQuantity == 0) {
          this.openLocationOptions(this.product?.stocks?.locationStockList)
        }
      }
    });
  }
  initializeCartData() {
    this.cart = JSON.parse(localStorage.getItem('cart'));
    this.cartService.setCartData(this.cart);
    if (this.cart || this.cart?.length >= 1) {
      this.ExistInCart()
    }
  }
  ExistInCart() {
    const found = this.cart.some(el => el._id === this.product._id);
    this.addedToCard = found;
  }
  checkout() {
    this.openVariationOption()
    .then((res) => {
      console.log(res);
      if(res != 'no-variation') {
        this.product.selectedVariation = res;
      }
      this.product.orderedQuantity = 1;
      this.product.price = this.productPrice;
      this.product.totalPrice = this.product.price * this.product.orderedQuantity;
      this.product.stocks.locationStockList.forEach(element => {
        if(element.location._id === this.locationId) {
          this.product.newStocks = element
        }
      });
      this.router.navigate(['product/checkout'], { state: { checkoutData: [this.product] } });
    })
    .catch((error) => {
      console.error(error);
    });
  }
  addToCart() {
    this.openVariationOption()
    .then((res) => {
      console.log(res);
      if(res != 'no-variation') {
        this.product.selectedVariation = res;
      }
      this.product.toCheckout = true;
      this.product.orderedQuantity = 1;
      this.product.price = this.productPrice;
      this.product.totalPrice = this.product.price * this.product.orderedQuantity;
      this.product.stocks.locationStockList.forEach(element => {
        if (element.location._id === this.locationId) {
          this.product.newStocks = element;
        }
      });

      if (this.cart != null) {
        this.cart.push(this.product);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.initializeCartData();
      } else {
        localStorage.setItem('cart', JSON.stringify([this.product]));
        this.initializeCartData();
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  removeToCart() {
    let newList = this.cart.filter(item => {
      return item._id != this.product._id;
    })
    localStorage.setItem('cart', JSON.stringify(newList));
    this.initializeCartData();
  }
  initPrice() {
    if(this.product.enableRetailSales) {
      if(this.product?.specialPrice == null) {
        this.productPrice = this.product?.retailPrice;
      } else {
        this.productPrice = this.product?.specialPrice;
      }
    } else {
      this.productPrice = this.product?.supplyPrice;
    }
  }
  setDefaultPic(e: any) {
    e.target.src = '/assets/images/product/img-thumbnail.jpg';
  }
  lessDescription = true;
  description(e){
    if(e) {
      if(this.lessDescription) {
        return e.slice(0, 650);
      } else {
        return e;
      }
    }
  }
  openLocationOptions(e) {
    const modalRef = this.modalService.open(LocationOptionComponent, {centered: true, });
    modalRef.componentInstance.locationList = e;
    modalRef.result.then(res => {
      this.locationId = res;
      this.getShopData()
    })
  }

  openVariationOption(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.product.variationLabel) {
        const offcanvasRef = this.offcanvasService.open(VariationOptionComponent, this._offcanvasConfig);
        offcanvasRef.componentInstance.product = this.product;
        offcanvasRef.componentInstance.dismissWithResult
          .subscribe((res) => {
            console.log(res);
            resolve(res); // Resolve with the result when the offcanvas is dismissed
          });
      } else {
        resolve('no-variation'); // Resolve with 'no-variation' if there is no variation
      }
    });
  }
}
