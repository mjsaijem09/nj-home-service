import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {
  @Output() cardOutput = new EventEmitter();
  ch: any;
  cc: any;
  ed: any;
  cv: any;
  defaultCard: any;
  cardIdToDelete = ''
  cards = [];
  isLoading: boolean = true;
  url: any;
  // Modals
  confirmationToSwitchModal: NgbModalRef | undefined;
  constructor(
    private toast: ToasterService,
    private modalService: NgbModal,
    private _http: ApiServicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCards();
    this.checkUrl();
  }
  checkUrl() {
    this.url = this.router.url;
    console.log(this.url)
  }
  loadCards() {
    this._http.get(`add_customer_in_stripe`)
    .subscribe(
      res => {
        this.defaultCard = res['result'].default_source;
        this.cards = res['result'].sources.data;
        this.isLoading = false;
      },
      err =>{
        this.isLoading = false;
      },
    );
  }
  selectCard(m, e) {
    if (this.defaultCard != e) {
      this.defaultCard = e;
      this.confirmationToSwitchModal = this.modalService.open(m, { centered: true });
    }
  }
  switch_card() {
    let body = {"cardId": this.defaultCard};
    this._http.post(`update_card_default`,body)
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
  addCardModal: any;
  add_card(m){
    this.addCardModal = this.modalService.open(m, { centered: true });
  }
  ramoveCard(m, e) {
    this.cardIdToDelete = e
    this.modalService.open(m, { centered: true });
  }
  delete_card() {
    this._http.delete(`delete_card/${this.cardIdToDelete}`)
    .subscribe(
      res => {
        if (res.status == 200) {
          console.log(res);
          this.loadCards();
          this.modalService.dismissAll('Close Modal')
        } else {
          this.toast.error(res.message);
          console.log(res);
        }
      },
    )
  }
  cc_format(e) {
    console.log(e);
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
  submitted:boolean = false;
  save_card() {
    this.submitted = true;
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
      res => {
          console.log(res)
          if (res.status == 200) {
            this.addCardModal.close();
            this.loadCards();
            this.cardOutput.emit(res);
            this.toast.success('Your card has been added successfully');
          } else {
            this.toast.info(res.message);
          }
      },
      err => {
        console.log(err.body);
        this.toast.error(err.body);
      }
    )
  }

}
