import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  isLoading: boolean = true;
  message = '';
  constructor(
    private http : ApiServicesService,
    private activeR: ActivatedRoute,
    private _route: Router
    ) {}

  ngOnInit(): void {
    this.cancelAppointment(this.activeR.snapshot.params.appointmentId)
  }

  cancelAppointment(appointmentId) {
    let body = {_id: appointmentId}
    this.http.put(`confirm_booking`, body)
    .subscribe(res => {
      this.isLoading = false;
      this.message = res.message;
    })
  }

  navigate() {
    this._route.navigate(['/']);
  }
}
