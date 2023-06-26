import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-add-relation',
  templateUrl: './add-relation.component.html',
  styleUrls: ['./add-relation.component.scss']
})
export class AddRelationComponent implements OnInit {
  addRelationForm:UntypedFormGroup;
  submitted = false
  loginData: any;
  clientId: any;
  emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  phoneNumberPattern = /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/;
  showEmailError: boolean = false;
  
  constructor(private NgbModal:NgbModal,
    private newToast:ToasterService,
    private service:ApiServicesService,
    private route:Router,
    private cdref: ChangeDetectorRef
    ) { 
    this.addRelationForm = new UntypedFormGroup({
      firstName: new UntypedFormControl(''),
      lastName: new UntypedFormControl(''),
      gender: new UntypedFormControl(''),
      relation: new UntypedFormControl(''),
      mobile: new UntypedFormControl('',  Validators.pattern(this.phoneNumberPattern)),
      email: new UntypedFormControl('', [Validators.required ,  Validators.pattern(this.emailPattern)]),

    })
  }
  // convenience getter for easy access to form fields
  get f() { return this.addRelationForm.controls; }

  ngOnInit(): void {
    this.loginData = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!)
    this.clientId=this.loginData.client
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // api for add relation
  onSubmit(){
    this.submitted=true;
    // stop here if form is invalid
    if (this.addRelationForm.invalid) {
      return;
      // this.newToast.warning("form is invalid")
    } 
    let data = {
      "id": this.clientId,
      "relations": [{
        "relationship": this.addRelationForm.value.relation,
        "firstName": this.addRelationForm.value.firstName,
        "lastName": this.addRelationForm.value.lastName,
        "email": this.addRelationForm.value.email,
        "phone1": this.addRelationForm.value.mobile,
        "gender": this.addRelationForm.value.gender
      }],
    }
    this.service.put(`relationship`,data).subscribe((res)=>{
      console.log(res);
      this.showEmailError = false;
      if(res.status==200){
        this.newToast.success("Relation added successfully.")
        this.route.navigate(['/book-for'])
        this.NgbModal.dismissAll();
      }
    }, (err) => {
      console.log(err);
    }
    )

  } 

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  // modal close
  navigateBack(){
    this.NgbModal.dismissAll();

  }
  selectGender(content:any) {
    this.NgbModal.open(content, { centered: true });
  }
  selectRelation(content:any){
    this.NgbModal.open(content, { centered: true });
  }

  setGender(){
    const gender = this.addRelationForm.controls.gender.value;
    this.addRelationForm.controls.gender.setValue(gender)
  }
  setRelation(){
    const relation = this.addRelationForm.controls.relation.value;
    this.addRelationForm.controls.relation.setValue(relation)
  }
}
