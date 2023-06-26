import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  ownerId = '';
  locationId = '';
  products: any = [];
  shopDetails
  allProductIsDisabled: boolean;
  isLoading = true;
  constructor(
    private httpService: ApiServicesService,
    private _activeR: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.ownerId = this._activeR.snapshot.paramMap.get('owner');
    this.locationId = this._activeR.snapshot.paramMap.get('location');
    this.getProducts();
    this.getShopDetails()
  }
  getProducts() {
    this.httpService.get(`products?ownerId=${this.ownerId}`)
    .subscribe( res => {
      console.log(res.result);
      res.result.forEach(product => {
        if(product.stocks.locationStockList) {
          product.stocks.locationStockList.forEach(stock => {
            if(stock.location._id == this.locationId) {
              let data = {
                name: product?.name,
                barcode: product?.barcode,
                primarySku: product?.primarySku,
                description: product?.description,
                images: product?.productImages,
                retailPrice: product?.retailPrice,
                specialPrice: product?.specialPrice,
                supplyPrice: product?.supplyPrice,
                stocks: stock?.stockQuantity,
                supplier: product?.supplier,
                sold: product?.sold,
                _id: product?._id,
              };
              if(product?.enableOnlineSale) {
                this.products.push(data);
              }
            }
          });
        }
      });
      console.log(this.products)
      this.allProductIsDisabled = this.products.every(element => element.enableOnlineSale === false);
      console.log(this.allProductIsDisabled);
      this.isLoading = false;
    })
  }
  getShopDetails() {
    this.httpService.get(`get_shop_detail?locationId=${this.locationId}&detail=true`).subscribe( 
      res => {
      this.shopDetails = res.result;
      },
      err => {
        console.log(err);
      }
    );
  }
  back() {
    this.location.back();
  }
}
