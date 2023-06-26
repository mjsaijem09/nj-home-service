import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private refresh = new Subject<any>();

  user = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
  
  constructor(private http: HttpClient) { }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  saveCard(card) {
    return this.http.post(`${environment.api_url}add_card`, card);
  }
  setDefault(cardId) {
    return this.http.post(`${environment.api_url}update_card_default`, cardId);
  }
  cards() {
    return this.http.get(`${environment.api_url}add_customer_in_stripe`);
  }

  getLoyaltyPoints() {
    return this.http.get(`${environment.api_url}my_loyalty_points?id=${this.user?.client}`);
  }
  deleteCard(cardId) {
    return this.http.delete(`${environment.api_url}delete_card/${cardId}`);
  }

  addCredits(body) {
    return this.http.post(`${environment.api_url}addMoney`, body);
  }

  loyalityPointList = (id: any) => this.http.get(`${environment.api_url}loyaltytransact?clientId=${this.user?.client}&locationId=${id}`)
  
  myCredits() {
    return this.http.get(`${environment.api_url}my_wallet`);
  }

  transaction() {
    return this.http.get(`${environment.api_url}findtransactions?customerId=${this.user?.result._id}`);
  }

  shopCredits() {
    return this.http.get(`${environment.api_url}shop_credit?clientId=${this.user?.client}`);
  }

  newUpdate(obj:any){
    this.refresh.next(obj)
  }

  detectChanges(): Observable<any> {
    return this.refresh.asObservable();
  }
}