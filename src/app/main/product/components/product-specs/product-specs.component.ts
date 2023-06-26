import { Component, OnInit } from '@angular/core';
import { NgbOffcanvas, NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-specs',
  templateUrl: './product-specs.component.html',
  styleUrls: ['./product-specs.component.scss']
})
export class ProductSpecsComponent implements OnInit {

  constructor(
    private offcanvasService: NgbOffcanvas,
    public activeOffcanvas: NgbActiveOffcanvas
  ) { }

  ngOnInit(): void {
  }

}
