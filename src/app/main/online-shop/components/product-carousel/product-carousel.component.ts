import { Component, OnInit, Input } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss']
})
export class ProductCarouselComponent implements OnInit {

  @Input() displayBy;
  @Input() title;
  @Input() shop;
  products = [];

  constructor(
    private _http: ApiServicesService,
  ) { }

  ngOnInit(): void {
    this.initProducts();
  }

  initProducts() {
    this._http.get(`products?ownerId=${this.shop.ownerid}`)
    .subscribe( res => {
      res.result.forEach(product => {
        if(product.stocks.locationStockList) {
          product.stocks.locationStockList.forEach(stock => {
            if(stock.location._id == this.shop.locationId && stock.stockQuantity >= 1) {
              let data = {
                name: product?.name,
                barcode: product?.barcode,
                primarySku: product?.primarySku,
                description: product?.description,
                images: product?.productImages,
                retailPrice: product?.retailPrice,
                specialPrice: product?.specialPrice,
                supplyPrice: product?.supplyPrice,
                stocks: stock?.stockQuantity,//Total stocks for currect location
                stockTotal: stock?.stockTotal,//total stocks for all location
                supplier: product?.supplier,
                sold: product?.sold,
                _id: product?._id,
                enableRetailSales: product?.enableRetailSales,
              };
              if(product?.enableOnlineSale) {
                this.products.push(data);
              }
            }
          });
        }
      });
      console.log(this.products)
    })
  }

}
