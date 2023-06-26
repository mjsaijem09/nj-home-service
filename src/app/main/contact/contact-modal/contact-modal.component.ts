import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['../contact.component.scss' ,'./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {
  @Input() public newContact;
  @Input() public modalOption;
  @Input() public isSuccess;
  imageUrl : string = "../../../../assets/images/carbon_user-avatar-filled.svg";
  url: any; 
	msg = "";
  imageFile : any;
  submitted: boolean = false;
  disabled: boolean = false;
  form: UntypedFormGroup;

  constructor(
    private service: ApiServicesService, 
    private newToast: ToasterService,
    private _fb: UntypedFormBuilder,
) { }

  ngOnInit(): void {
    this.imageUrl = this.newContact && this.newContact.image && this.newContact.image != '' ?  (this.newContact?.image.includes(environment.image_url) ? this.newContact.image :  environment.image_url + this.newContact.image)  : this.imageUrl;
    this.initForm();
  }
  initForm() {
    this.form = this._fb.group({
    firstName: new UntypedFormControl(this.newContact?.firstName || '', [Validators.required, this.noWhitespaceValidator]),
    lastName: new UntypedFormControl(this.newContact?.lastName || ''),
    email: new UntypedFormControl(this.newContact?.email || '', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    address: new UntypedFormControl(this.newContact?.address || ''),
    phone1: new UntypedFormControl(this.newContact?.phone1 || '', [Validators.required, this.noWhitespaceValidator]),
    relationship: new UntypedFormControl(this.newContact?.relationship || '', [Validators.required, this.noWhitespaceValidator]),
    work: new UntypedFormControl(this.newContact?.work || ''),
    });
  }
  get f() { return this.form.controls; }
  public noWhitespaceValidator(control: UntypedFormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  handleSubmmit(f){
    this.submitted = true;
    if(f.status == 'VALID') {
      this.disabled = true;
      let url = this.newContact.header == 'Edit Contact' ? 'relationship_update' : '/relationship' 
      let payload = {}    
      payload["id"] = this.newContact.id;
      if(this.newContact.header == 'Edit Contact') {
        let relation = f.value;
        payload['clientId'] = this.newContact.clientId;
        relation.id = this.newContact.id;
        relation._id = this.newContact._id;
        payload["relations"] = [relation];
      } else {
        payload["relations"] = [f.value];
      }
      if(this.imageFile){
        // this.newContact.image = this.uploadImage();
        const formData: any = new FormData();
        formData.append("photos", this.imageFile);
        this.service.postImage("assets/uploadImages", formData).subscribe(
        (res) => {
          payload["relations"][0].image  = res["result"][0];
          this.service.put(url, payload).subscribe(
          (res) => {
            if(res){
              this.newToast.success(this.newContact.header == 'Edit Contact' ? 'Contact updated' : 'Contact created' , true, 1000);
              this.modalOption.close('Submit');
              this.disabled = false;
            }
          },
          (err) => {
            this.disabled = false;
            this.newToast.error(this.newContact.header == 'Edit Contact' ? 'Contact update failed' : 'Contact creation failed', true, 1000);
          });
        },
        (rej) => {
          this.newToast.error('Image Upload Failed', true, 1000);
        }
        );
      }
      else {
        this.service.put(url, payload).subscribe((res) => {
          if(res){
            this.newToast.success(this.newContact.header == 'Edit Contact' ? 'Contact updated' : 'Contact created' , true, 1000);
            this.modalOption.close('Submit');
            this.disabled = false;
          }
        },(err) => {
          this.newToast.error(this.newContact.header == 'Edit Contact' ? 'Contact update failed' : 'Contact creation failed', true, 1000);
          this.disabled = false;
        }
        );
      }
    }
    
  }

  onClose() {
      this.modalOption.close('Close');
    
  }

  rederImageUrl(event: any) { //Angular 11, for stricter type
		if(!event.target.files[0] || event.target.files[0].length == 0) {
			this.msg = 'You must select an image';
			return;
		}
		
		var mimeType = event.target.files[0].type;
		
		if (mimeType.match(/image\/*/) == null) {
			this.msg = "Only images are supported";
			return;
		}
		
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
			this.msg = "";
			this.url = reader.result; 
      if(this.url) {
        this.imageUrl = this.url
        this.imageFile = event.target.files[0]
      }
      else {
        this.imageUrl = "../../../../assets/images/carbon_user-avatar-filled.svg";
      }
		}
	}
}
