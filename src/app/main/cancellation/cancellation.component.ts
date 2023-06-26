import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cancellation',
  templateUrl: './cancellation.component.html',
  styleUrls: ['./cancellation.component.scss']
})
export class CancellationComponent implements OnInit {
  isLoading: boolean = true;
  message = '';
  constructor(
    private http : ApiServicesService,
    private activeR: ActivatedRoute,
    private _route: Router
  ) {}

  ngOnInit(): void {
    this.cancelAppointment(this.activeR.snapshot.params.clientId, this.activeR.snapshot.params.booking_reference)

  }
  cancelAppointment(clientId, bookingReference) {
    this.http.delete(`cancel_appointment?clientId=${clientId}&booking_reference=${bookingReference}`)
    .subscribe(res => {
      this.isLoading = false;
      this.message = res.message;
    })

  }

  navigate() {
    this._route.navigate(['/']);
  }

}
