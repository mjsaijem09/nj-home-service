import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { environment } from 'src/environments/environment';
import { ContactModalComponent } from './contact-modal/contact-modal.component';
import { ViewPortService } from 'src/app/services/view-port.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})

export class ContactComponent implements OnInit {
  public user = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
  public searchContactText: any = "";
  public contacts : any = [];
  constructor(
    private service: ApiServicesService,
    private modalService: NgbModal,
    private ViewPort: ViewPortService
  ) {
  }

  ngOnInit(): void {
    this.getRelations();
  }

  getRelations() {
    this.service
      .get(
        `find_relations/${this.user?.client}`
      )
      .subscribe((res: any) => {
        if(res.ClientRelations.length > 0){
          this.contacts = [];
          res.ClientRelations.forEach(element => {
            element.id = this.user?.client;
            this.contacts.push(element)
          });
        }
      });
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  generateImage(img) {
    return img ? (img.includes(environment.image_url) ? img :  environment.image_url + img) : "assets/images/carbon_user-avatar-filled.svg";
  }

  generateImageSize(img) {
    return img ? 'cover' : 'contain'
  }

  createContact() {
    const modalRef = this.modalService.open(ContactModalComponent, {centered: true, windowClass : "_contact"});
    modalRef.componentInstance.newContact = {
      firstName : "",
      lastName: "",
      email: "",
      phone1: "",
      image: "",
      work: "",
      relationship : "",
      address : "",
      id : this.user?.client,
      header : 'Add New Contact'
    };
    modalRef.componentInstance.modalOption = modalRef;
    modalRef.result.then((res) => {
      console.log(res)
      if(res == 'Submit'){
        this.getRelations();
      }
      
    });
  }

  onFocusEvent(e) {
    console.log(e)
  }

}
