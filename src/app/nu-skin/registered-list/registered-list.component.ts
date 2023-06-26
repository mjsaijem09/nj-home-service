import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-registered-list',
  templateUrl: './registered-list.component.html',
  styleUrls: ['./registered-list.component.scss'],
})
export class RegisteredListComponent implements OnInit {
  data: any = [];

  constructor(
    private router: Router,
    private service: ApiServicesService,
    private newToast: ToasterService
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.service.getNuskin('').subscribe((res) => {
      if (res.result) {
        this.data = res.result;
        console.log(this.data);
      }
    });
  }

  goToRegister() {
    this.router.navigateByUrl('event/registration');
  }
}
