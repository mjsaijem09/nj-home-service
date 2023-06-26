import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMoneyComponent } from '../add-money/add-money.component';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { CreditService } from '../credit.service'
import * as moment from 'moment';
@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {
  user = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
  isLoading: boolean = false;
  isToggle = false;
  accBalance = 0;
  transactions: any;
  shopCredits: any;
  constructor(
    public modal:NgbModal,
    private _http: ApiServicesService,
    private _creditService: CreditService,
  ) { }

  ngOnInit(): void {
    this.loadCredits()
    this.loadTransactionList()
    this.loadShopCredits()
    this._creditService.detectChanges()
    .subscribe(() => {
      this.loadCredits()
    })
  }
  wallet_transaction_list = [];
  wallet_transaction = [];
  loadCredits() {
    this.isLoading = true;
    this._http.get('my_wallet')
    .subscribe(res => {
      if (res['status'] == 200) {
        this.accBalance = res['result'].walletBalance;
        this.wallet_transaction_list = res['result'].transaction_list;
        this.wallet_transaction = this.wallet_transaction_list.slice(0, 5);
        this.isLoading = false;
      } else {
        
      }
    })
  }
  toggleMoreOrLess() {
    console.log(this.wallet_transaction.length);
    if(this.wallet_transaction.length <= 5) {
      this.wallet_transaction = this.wallet_transaction_list;
    } else {
      this.wallet_transaction = this.wallet_transaction_list.slice(0, 5);
    }
  }
  toggle(){
    this.isToggle = !this.isToggle;
    this.toggleMoreOrLess();
  }
  loadTransactionList() {
    this._http.get(`findtransactions?customerId=${this.user?.result._id}`)
    .subscribe(res => {
      if (res['status'] == 200) {
        this.transactions = res['result'];
      } else {
        
      }
    })
  }
  loadShopCredits() {
    this._http.get(`shop_credit?clientId=${this.user?.client}`)
    .subscribe(res => {
      if (res['status'] == 200) {
       this.shopCredits = res['result']
      } else {
        console.log('SHOP_CREDITS', res)
      }
    })
  }
  addMoney() {
    this.modal.open(AddMoneyComponent, { centered: true , size: 'sm'});
  }
  
  shopCreditsTotal(e) {
    let points = 0;
      e.shopCreditList.forEach(obj => {
        points += obj.amount;          
      });
    return points;
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}
