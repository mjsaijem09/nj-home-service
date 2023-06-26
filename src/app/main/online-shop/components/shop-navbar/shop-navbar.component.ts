import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-shop-navbar',
  templateUrl: './shop-navbar.component.html',
  styleUrls: ['./shop-navbar.component.scss']
})
export class ShopNavbarComponent implements OnInit {
  @Output() navOutput: EventEmitter<String> = new EventEmitter();
  @Input() activeNav: string;
  shopNav = 'shop';
  constructor() { }
  
  ngOnInit(): void {
    this.navOutput.emit(this.shopNav);
  };
  
  ngAfterViewInit(): void {
    console.log(this.activeNav);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.activeNav) {
      // Access the updated activeNav value
      this.shopNav = changes.activeNav.currentValue;

      // Perform any logic based on the updated activeNav value
      console.log('Active navigation changed:', this.shopNav);
    }
  }

  navigate(path: string): void {
    this.shopNav = path;
    this.navOutput.emit(path);
  }
}
