import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search-in-shop',
  templateUrl: './search-in-shop.component.html',
  styleUrls: ['./search-in-shop.component.scss']
})
export class SearchInShopComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit(): void {
  }

  goBack() {
    this.location.back();
  }
  
}
