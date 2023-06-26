import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class Auth implements CanActivate {
  constructor(private _router: Router) {
  }
  canActivate():any {
    if (this.getCookie('customerToken')) {
      return true;
    }
    else{
        this._router.navigateByUrl('auth/login');
    }
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}