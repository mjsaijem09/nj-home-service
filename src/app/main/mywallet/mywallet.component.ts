import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-mywallet',
  templateUrl: './mywallet.component.html',
  styleUrls: ['./mywallet.component.scss']
})
export class MywalletComponent implements OnInit {

  selected = 'c';
  constructor() {
  }
  ngOnInit(): void {
  }
  
  nav(e:string) {
    this.selected = e;
  }
  
}
