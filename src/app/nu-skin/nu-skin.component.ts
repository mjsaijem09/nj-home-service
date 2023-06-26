import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nu-skin',
  templateUrl: './nu-skin.component.html',
  styleUrls: ['./nu-skin.component.scss'],
})
export class NuSkinComponent implements OnInit {
  nextPage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  backToRegister() {
    this.router.navigateByUrl('event/registration');
  }
}
