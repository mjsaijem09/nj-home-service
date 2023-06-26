import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-invite-friend',
  templateUrl: './invite-friend.component.html',
  styleUrls: ['./invite-friend.component.scss']
})
export class InviteFriendComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }
  customerDetails: any;
  referralLink: any;
  ngOnInit(): void {
    this.customerDetails = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
    this.referralLink = `${this.document.location.origin}/auth/invite/${this.customerDetails.result.customerIdNumber}`
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  copyToClipBoard(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
}
