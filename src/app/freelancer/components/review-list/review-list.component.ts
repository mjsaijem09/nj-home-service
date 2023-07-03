import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
  @Input() minimize: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
