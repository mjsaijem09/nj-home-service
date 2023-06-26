import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dynamic-card',
  templateUrl: './dynamic-card.component.html',
  styleUrls: ['./dynamic-card.component.scss']
})
export class DynamicCardComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() componentData : any;
  @Input() componentImage : any = {};

  ngOnInit(): void {
  }

  ngOnChanges() {
    // console.log(changes);
    console.log(this.componentData);
    console.log(this.componentImage)
  }

}
