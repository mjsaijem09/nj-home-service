import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GiftcardService {
  private giftcardDetails = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) { }

  setGiftcardDetails(obj?: any) {
    this.giftcardDetails.next(obj);
  }

  getGiftcardDetails(): Observable<any> {
    return this.giftcardDetails.asObservable();
  }
  
  isMobileView(){
    if (window.innerWidth  >= 768) {
      return false;
    }else{
      return true;
    }
  }
}
