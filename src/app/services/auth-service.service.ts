import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  public cachedRequests: Array<HttpRequest<any>> = [];
  public token: any = this.getCookie('customerToken');
  constructor(public http: HttpClient) {
  }
  public getToken(): string|null {

    //if(this.token)
    //return this.token;
    //else
    let token : string | null;
    token = this.getCookie('customerToken');
    return token;
  }

  public getUserData(){
    return this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}
