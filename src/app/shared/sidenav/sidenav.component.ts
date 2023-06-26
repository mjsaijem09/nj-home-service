import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  isSidenav: boolean = true;

  constructor(private route : Router) { }

  ngOnInit(): void {
    this.route.events.subscribe(res=>{
      if(this.route.url.includes('home')){
        this.isSidenav = true;
      }else{
        this.isSidenav = false;
      }
    })
  }

}
