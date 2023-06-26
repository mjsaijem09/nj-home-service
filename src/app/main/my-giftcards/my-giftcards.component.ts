import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-giftcards',
  templateUrl: './my-giftcards.component.html',
  styleUrls: ['./my-giftcards.component.scss']
})
export class MyGiftcardsComponent implements OnInit {
  selected = 'received';
  ShowMobile: boolean = true

  constructor() { }

  ngOnInit(): void {
    this.getScreenSize();
  }

  selectedTab(e:string) {
    this.selected = e;
    console.log(this.selected);
  }

  getScreenSize() {
    let ScreenWidth = window.innerWidth
    // this.ScreenHeight = window.innerHeight
    if (ScreenWidth > 1024) {
      this.ShowMobile = false
    } else {
      this.ShowMobile = true
    }

  }

}
