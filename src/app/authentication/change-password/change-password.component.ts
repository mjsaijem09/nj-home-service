import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ConfirmPasswordValidator } from '../confirm-password.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  closeResult: string | undefined;
  password_form: UntypedFormGroup;
  submitted: boolean = false;
  email: any;
  apiOtp: any;
  constructor(private active: ActivatedRoute,
    private service: ApiServicesService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private newToast: ToasterService,
    private modalService: NgbModal
  ) {
    this.password_form = fb.group({
      oldPass: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(8)]),
      confirmpassword: new UntypedFormControl('', [Validators.required])
    },
      {
        validator: ConfirmPasswordValidator("password", "confirmpassword")
      }
    );

  }

  ngOnInit(): void {
    this.password_form.controls['oldPass'].valueChanges.subscribe(change => {
      if(/\s/g.test(change)) {
        let value = change.replace(/\s/g, '');
        this.password_form.controls['oldPass'].setValue(value);
      }
    });
    this.password_form.controls['password'].valueChanges.subscribe(change => {
      if(/\s/g.test(change)) {
        let value = change.replace(/\s/g, '');
        this.password_form.controls['password'].setValue(value);
      }
    });
    this.password_form.controls['confirmpassword'].valueChanges.subscribe(change => {
      if(/\s/g.test(change)) {
        let value = change.replace(/\s/g, '');
        this.password_form.controls['confirmpassword'].setValue(value);
      }
    });
  }

  // api to reset password
  confirm(content: any) {
    this.submitted = true
    const customerDetails = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
    if (!customerDetails || !customerDetails.result || !customerDetails.result._id){
      return;
    }
   
    let data = {
      'oldPass': this.password_form.value.oldPass,
      'password': this.password_form.value.password
    }
    if (this.password_form.valid) {
      this.service.post(`change_password/` + customerDetails.result._id, data).subscribe((res: any) => {
        if (res.status == 200) {
          this.openVerticallyCentered(content)
        }
      }, (err) => {
        this.newToast.error(err.error)
      })
    }

  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // convenience getter for easy access to form fields
  get f() { return this.password_form.controls; }
  openVerticallyCentered(content:any) {
    this.modalService.open(content, { centered: true });
  }
  mpw_is_show = false;
  pw_is_show = false;
  cpw_is_show = false;
  mpw = 'password';
  pw = 'password';
  cpw = 'password';
  show_hide_pw(e) {
    if (e === 'mpw') {
      this.mpw_is_show = !this.mpw_is_show;
      if (this.mpw_is_show) {
        this.mpw = 'text';
      } else {
        this.mpw = 'password';
      }
    }
    if (e === 'pw') {
      this.pw_is_show = !this.pw_is_show;
      if (this.pw_is_show) {
        this.pw = 'text';
      } else {
        this.pw = 'password';
      }
    }
    if (e === 'cpw') {
      this.cpw_is_show = !this.cpw_is_show;
      if (this.cpw_is_show) {
        this.cpw = 'text';
      } else {
        this.cpw = 'password';
      }
    }
  }
}
