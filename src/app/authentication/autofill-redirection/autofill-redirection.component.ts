import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="custom-modal">
      <div class="modal-header">
        <h4 class="modal-title">Hi there!</h4>
        <button
          type="button"
          class="close"
          aria-label="Close"
          (click)="activeModal.dismiss('Cross click')"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body text-center">
        <p>Hello, {{ name }}!</p>
        <p>Do you wish to logout your account?</p>
        <div class="actions">
          <button type="button" class="btn btn-accept" (click)="close()">
            No
          </button>
          <button type="button" class="btn btn-cancel" (click)="navigate()">
            Yes
          </button>
        </div>
      </div>
      <div class="modal-footer"></div>
    </div>
  `,
})
export class NgbdModalContent {
  @Input() name;
  @Input() url;
  constructor(public activeModal: NgbActiveModal, private route: Router) {}
  navigate() {
    console.log(this.url);
    this.deleteCookie('customerLogin');
    this.route.navigateByUrl(this.url);
    this.activeModal.close();
  }
  close() {
    this.route.navigateByUrl('/');
    this.activeModal.close();
  }
  deleteCookie(name) {
    if (document.domain === 'localhost') {
      document.cookie =
        name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    } else {
      document.cookie =
        name +
        '=; domain=.thebookus.com; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }
}
@Component({
  selector: 'app-autofill-redirection',
  templateUrl: './autofill-redirection.component.html',
  styleUrls: ['./autofill-redirection.component.scss'],
})
export class AutofillRedirectionComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private route: Router,
    private modalService: NgbModal
  ) {}

  loginData =
    this.getCookie('customerLogin') &&
    JSON.parse(this.getCookie('customerLogin')!);
  url = '';
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.http
        .get(`${environment.image_url}/api/sort-url/${param.code}`)
        .subscribe((res) => {
          let [base, url] = res['result'].split(`${environment.image_url}/`);
          if (!this.loginData) {
            this.url = url;

            this.route.navigateByUrl(url);
          } else {
            this.open(url);
          }
        });
    });
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  open(url) {
    const modalRef = this.modalService.open(NgbdModalContent, {
      centered: true,
    });
    let customerName = this.loginData.result.firstName;
    modalRef.componentInstance.name = customerName;
    modalRef.componentInstance.url = url;
  }
}
