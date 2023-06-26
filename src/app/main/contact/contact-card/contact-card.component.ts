import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss']
})
export class ContactCardComponent implements OnInit {
  @Input() data : any;
  @Input() image : any;
  @Input() _size : any;
  
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  updateContact() {
    const modalRef = this.modalService.open(ContactModalComponent, {centered: true, windowClass : "_contact"});
    this.data.header = 'Edit Contact';
    modalRef.componentInstance.newContact = this.data
    modalRef.componentInstance.modalOption = modalRef;
    modalRef.result.then((res) => {
      console.log(res)
      if(res == 'Submit'){
        const _modalRef = this.modalService.open(ContactModalComponent, {centered: true, windowClass : "_contact"});
        _modalRef.componentInstance.isSuccess = true;
        _modalRef.componentInstance.modalOption = _modalRef;
      }      
    });
  }

}
