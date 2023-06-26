import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {
  maxDate: any = moment().format('YYYY-MM-DD');
  data: any = {
    dob: '',
    address: '',
    tin: '',
    phone: '',
    firstName: '',
    lastName: '',
    email: '',
    invitedBy: '',
  };
  isSubmitted: boolean = false;
  emptyCount: any = 0;
  constructor(
    private router: Router,
    private service: ApiServicesService,
    private newToast: ToasterService
  ) {}

  ngOnInit(): void {}

  firstPhaseSubmit() {
    this.emptyCount = 0;
    for (var key in this.data) {
      if (
        key != 'address' &&
        key != 'dob' &&
        key != 'email' &&
        key != 'tin' &&
        key != 'invitedBy' &&
        this.data[key] === ''
      ) {
        this.emptyCount++;
      }
    }
    if (this.emptyCount > 0) {
      this.newToast.error('Required field is empty!', true, 1000);
      return;
    }
    this.isSubmitted = true;
  }

  submitRegistration() {
    if (this.emptyCount > 0) {
      this.newToast.error('Required field is empty!', true, 1000);
      return;
    }
    this.service.postNuskin('', this.data).subscribe((res) => {
      if (res.result) {
        this.newToast.success('Registered Successfully!', true, 1000);
        this.router.navigateByUrl('event');
      }
    });
  }
}
