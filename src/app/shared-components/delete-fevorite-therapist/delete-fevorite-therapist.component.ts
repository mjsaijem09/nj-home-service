import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-fevorite-therapist',
  templateUrl: './delete-fevorite-therapist.component.html',
  styleUrls: ['./delete-fevorite-therapist.component.scss']
})
export class DeleteFevoriteTherapistComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closePopup(value:boolean) {
    this.activeModal.dismiss(value);
  }

}
