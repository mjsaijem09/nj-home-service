import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit  {
  @Input() data;
  @ViewChild('shoppingCart') shoppingCart: ElementRef;
  constructor() { }

  ngOnInit(): void {
    console.log("data: ", this.data)
    this.data.forEach((shop, a) => {
      console.log('Index', a);
      shop.products.forEach((product, b) => {
        if (product.hasOwnProperty('toCheckout')) {
          // Key exists
          console.log('Key exists in index', b);
        } else {
          // Key does not exist
          console.log('Key exists in index', b);
        }
        console.log(product);
      });
    });
  }
  ngAfterViewInit(): void {
    setInterval(() => {
      this.checkProductGroupSelection();
    }, 500);
  }

  default_img(e: any) {
    e.target.src = '/assets/images/product/img-thumbnail.jpg';
  }

  includeAllInShop(i, element) {
    const allTrue = this.data[i].products.every((product) => product.toCheckout === true);
    if (allTrue) {
      element.classList.remove('selected');
      this.data[i].products.forEach(element => {
        element.toCheckout = false;
      });
    } else {
      element.classList.add('selected');
      this.data[i].products.forEach(element => {
        element.toCheckout = true;
      });
    }
    // this.data[i].products.forEach(product => {
    //   let booleanArr = [true, false, false];
    //   if (product.toCheckout) {
    //   }
    // });
  }

  checkProductGroupSelection() {
    const productGroups = this.shoppingCart.nativeElement.querySelectorAll('.product-group');

    productGroups.forEach((productGroup: HTMLElement) => {
      const productItems = productGroup.querySelectorAll('.product-item');
      const productShopCheckbox = productGroup.querySelector('.product-shop .checkbox');

      let allSelected = true;

      productItems.forEach((productItem: Element) => {
        // const checkbox = productItem.querySelector('.checkbox') as HTMLElement;
        const checkbox = productItem.querySelector('.checkbox');
        if (!checkbox.classList.contains('selected')) {
          allSelected = false;
        }
      });

      if (allSelected) {
        productShopCheckbox.classList.add('selected');
      } else {
        productShopCheckbox.classList.remove('selected');
      }
    });
  }

}