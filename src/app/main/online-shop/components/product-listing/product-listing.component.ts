import { Component, OnInit, Input } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {
  @Input() sortSetting: boolean;
  @Input() shopData;
  activeNav = 'popular';
  products = [];
  constructor(
    private _http: ApiServicesService,
  ) { }

  ngOnInit(): void {
    this.initProducts();
  }

  initProducts() {
    this._http.get(`products?ownerId=${this.shopData.ownerid}`)
    .subscribe( res => {
      res.result.forEach(product => {
        if(product.stocks.locationStockList) {
          product.stocks.locationStockList.forEach(stock => {
            if(stock.location._id == this.shopData.locationId && stock.stockQuantity >= 1) {
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

  sortBy(e) {
    this.activeNav = e;
  }
}
