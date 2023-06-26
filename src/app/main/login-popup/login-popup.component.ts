import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private router : Router
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.router.navigateByUrl('/auth/login');
    this.activeModal.close();
  }

  signUp() {
    this.router.navigateByUrl('/auth/register');
    this.activeModal.close();
  }

}
