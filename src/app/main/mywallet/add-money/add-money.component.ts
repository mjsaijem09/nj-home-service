import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { CreditService } from '../credit.service'
@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styleUrls: ['./add-money.component.scss']
})
export class AddMoneyComponent implements OnInit {
  cards = [];
  isLoading: boolean = true;
  defaultCard: any;
  ch: any;
  cc: any;
  ed: any;
  cv: any;

  amount: any;
  isClicked = false;
  addcardModal: NgbModalRef | undefined;
  confirmationToSwitchModal: NgbModalRef | undefined;
  accCreditModal: NgbModalRef | undefined;

  processing_fee: any;
  total_amount: any;
  constructor(
    private modal:NgbModal,
    private _http: ApiServicesService,
    private toast: ToasterService,
    private _creditService: CreditService,
  ) { }

  ngOnInit(): void {
    this.loadCards();
  }
  loadCards() {
    this._http.get(`add_customer_in_stripe`)
    .subscribe(data => {
      this.isLoading = false;
      this.defaultCard = data['result'].default_source;
      let cards = data['result'].sources.data;
      this.cards = cards;
    });
  }
  brandName(e) {
    if(e.length >=12) {
      let b = e.substr(0, 12);
      return b+'...';
    } else if(e.length < 5){
      return e+'Card';
    } else {
      return e;
    }
  }
  cc_format(e) {
    var v = e.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    var matches = v.match(/\d{4,16}/g);
    var match = matches && matches[0] || ''
    var parts = []

    for (let i=0, len=match.length; i<len; i+=4) {
        parts.push(match.substring(i, i+4))
    }

    if (parts.length) {
        return this.cc = parts.join(' ')
    } else {
        return this.cc = e
    }
  }
  ed_format(e) {
    if(e.length <= 1) {
      let currentYear= new Date().getFullYear(); 
      let newDate = `0${e} / ${currentYear}`;
      return this.ed = newDate
    }
  }
  add_card(m){
    this.addcardModal = this.modal.open(m, { centered: true });
  }
  closeModel() {
    this.modal.dismissAll();
  }
  save_card() {
    let cn = this.cc.replaceAll(/\s/g,'')
    let mY = this.ed.split(/[/]+/).map(s => Number(s));
    let month = mY[0];
    let year = mY[1];
    const body = {
      "card": {
        "number": cn,
        "exp_month": month,
        "exp_year": year,
        "cvc": this.cv,
        "name": this.ch
      }
    }
    this._http.post(`add_card`, body).subscribe(
      data => {
        if(data['status'] == 200){
          this.addcardModal.close()
          this.loadCards();
        }
      },
      error => {
        this.toast.error(error.error.body);
      }
    )
  }
  selectCard(m, e) {
    if (this.defaultCard != e) {
      this.defaultCard = e;
      this.confirmationToSwitchModal = this.modal.open(m, { centered: true });
    }
  }
  switch_card() {
    let body = {"cardId": this.defaultCard};
    this._http.post(`update_card_default`, body)
    .subscribe(data => {
      if(data['status'] == 200) {
        this.loadCards();
        this.confirmationToSwitchModal.close()
      }
    })
  }
  cancelSwitch() {
    this.loadCards();
    this.confirmationToSwitchModal.close()
  }
  checkProcessingFee(e) {
    this._http.get(`get_processing_fee?amount=${e}`)
    .subscribe(res => {
      this.processing_fee = res.processingFee
      this.total_amount = res.total_amount
    })
  }
  addCredits() {
    this.isClicked = true;
    let payment = {
      "amount": this.total_amount - this.processing_fee,
      "processingFee": this.processing_fee,
      "currency": "aud"
    }
    this._http.post(`addMoney`, payment)
    .subscribe(res => {
      if (res['status'] == 200) {
        this.modal.dismissAll();
        this.isClicked = false
        this._creditService.newUpdate("Has new Update!")
      } else {
        console.log("ERROR!", res)
        this.isClicked = false
      }
    })
  }
}
