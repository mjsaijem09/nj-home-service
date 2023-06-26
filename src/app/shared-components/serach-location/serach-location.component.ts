import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-serach-location',
  templateUrl: './serach-location.component.html',
  styleUrls: ['./serach-location.component.scss']
})
export class SerachLocationComponent implements OnInit {

  constructor(
    private zone: NgZone,
    private ngbModalService : NgbActiveModal,
    private formbuilder:UntypedFormBuilder,
    private service:ApiServicesService
  ) { }

  addrKeys: any;
  addr: any;
  addrSel: boolean = true;
  ngOnInit(): void {
    // this.form()
  }
  
  closeModal(e:any) {
    this.ngbModalService.close();
  }

  setAddress(addrObj: any) {
    console.log(addrObj);
    //We are wrapping this in a NgZone to reflect the changes
    //to the object in the DOM.
    if (addrObj)
    localStorage.setItem('customerLocation',JSON.stringify(addrObj));
    this.service.setCustomerLocation(addrObj)
    this.ngbModalService.dismiss()
    console.log('4564=>>>>>>',addrObj);
    
    if (addrObj.postal_code)
      // this.addLocationForm.get('zip').setValue(addrObj.postal_code);

    if (addrObj.admin_area_l1)
      // this.addLocationForm.get('state').setValue(addrObj.admin_area_l1);

      if(addrObj.utc_offset)
      // this.addLocationForm.get('timeOffset').setValue(addrObj.utc_offset);
    
    // this.addLocationForm.get('street').setValue("");
    if (addrObj.route) {
      // this.addLocationForm.get('street').setValue(addrObj.route);
    }
    if (addrObj.sublocality_level_3) {
      // const street = this.addLocationForm.get('street').value;
      // this.addLocationForm.get('street').setValue(street + (street ? ', ' : '') + addrObj.sublocality_level_3);
    }
    if (addrObj.sublocality_level_2) {
      // const street = this.addLocationForm.get('street').value;
      // this.addLocationForm.get('street').setValue(street + (street ? ', ' : '') + addrObj.sublocality_level_2);
    }
    if (addrObj.sublocality_level_1) {
      // const street = this.addLocationForm.get('street').value;
      // this.addLocationForm.get('street').setValue(street + (street ? ', ' : '') + addrObj.sublocality_level_1);
    }

    if (addrObj.street_number)
      // this.addLocationForm.get('building').setValue(addrObj.street_number);

    if (addrObj.geo_location) {
      this.addrSel = false;
      // this.addLocationForm.get('geo_location').setValue(addrObj.geo_location);
    } else {
      // this.addrSel = true;
    }

    this.zone.run(() => {
      this.addr = addrObj;
      this.addrKeys = Object.keys(addrObj);
    });
  }

  OnAddrChg(e: any) {
    if (e == "") { this.addrSel = true }
  }

}
