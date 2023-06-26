import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import Stepper from 'bs-stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignaturePad } from 'angular2-signaturepad';
import {
  FormArray,
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { GlobalValidationService } from '../home/global-validation.service';
import { ViewPortService } from 'src/app/services/view-port.service';
@Component({
  selector: 'app-intake-form',
  templateUrl: './intake-form.component.html',
  styleUrls: ['./intake-form.component.scss'],
})
export class IntakeFormComponent implements OnInit, AfterViewInit {
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;
  private stepper: Stepper | any;
  intakeForm: UntypedFormGroup | any;

  validationMessages = {
    'firstName': {
      'required': 'First Name is required.',
      'pattern': 'Please provide valid Name avoid using special charecter'
    },
    'lastName': {
      'required': 'Last Name is required.',
      'pattern': 'Please provide valid Name avoid using special charecter'
    },
    'email': {
      'required': 'Email is required.',
      'pattern': 'Please provide valid Email ID'
    },
    'phone1': {
      'required': 'Number is required.',
      'pattern': 'Please provide valid Phone Number avoid using special charecter'
    }, 
    'dob': {
      'required': 'Date is required.',
      'pattern': 'Please provide valid Date avoid using special charecter'
    },
    'area': {
      'required': 'Address is required.',
      'pattern': 'Please provide valid Address avoid using special charecter'
    },
    'city': {
      'required': 'City is required.',
      'pattern': 'Please provide valid City avoid using special charecter'
    },
    'state': {
      'required': 'State is required.',
      'pattern': 'Please provide valid State avoid using special charecter'
    },
    'emergencyContactName': {
      'required': 'Name is required.',
      'pattern': 'Please provide valid Name avoid using special charecter'
    },
    'emergencyContactRelation': {
      'required': 'Realtion is required.',
      'pattern': 'Please provide valid Relation Name avoid using special charecter'
    },
    'emergencyContactNo': {
      'required': 'Number is required.',
      'pattern': 'Please provide valid Number avoid using special charecter'
    }, 
    'medicationDetails': {
      'required': 'Details is required.',
      'pattern': 'Please provide valid Details avoid using special charecter'
    }, 
    'pregnancyDuration': {
      'required': 'Duration is required.',
      'pattern': 'Please provide valid Details avoid using special charecter'
    },
    'pregnancyRiskFactor': {
      'required': 'Risk details is required.',
      'pattern': 'Please provide valid Details avoid using special charecter'
    }, 
    'chronicPainDetails': {
      'required': 'Pain details is required.',
      'pattern': 'Please provide valid Details avoid using special charecter'
    },
    'chronicPainMakesBetter': {
      'required': 'Description is reqired',
      'pattern': 'Please provide valid Details avoid using special charecter'
    },
    'chronicPainMakesWorse': {
      'required': 'Description is reqired',
      'pattern': 'Please provide valid Details avoid using special charecter'
    }, 
    'orthoInjuriesDetails': {
      'required': 'Details is required.',
      'pattern': 'Please provide valid Details avoid using special charecter'
    }, 
    'diseasesDescription': {
      'required': 'Description is required.',
      'pattern': 'Please provide valid Details avoid using special charecter'
    }, 
    'allergiesDetails': {  
      'required': 'Details is required.',
      'pattern': 'Please provide valid Details avoid using special charecter'
    }, 
    'avoidingAreasDetails': {
      'required': 'Details is required.',
      'pattern': 'Please provide valid Details avoid using special charecter'
    }, 
  };
  formErrors:any = {};
  shopName: any;
  serviceName: any;
  serviceTime: any;
  servicePrice: any;
  therapistName: any;
  timeSlot: any;
  @Input() intakeFormData : any;
  @Output() intakeDataSelected : EventEmitter<any> = new EventEmitter();
  Desisese: any = [
    { name: 'Cancer', selected: false },
    { name: 'Headaches/Migraines', selected: false },
    { name: 'Arthritis', selected: false },
    { name: 'Diabetes', selected: false },
    { name: 'Joint Replacement', selected: false },
    { name: 'High/Low Blood Pressure', selected: false },
    { name: 'Neuropathy', selected: false },
    { name: 'Fibromyalgia', selected: false },
    { name: 'Stroke', selected: false },
    { name: 'Heart Attack', selected: false },
    { name: 'Kidney Dysfunction', selected: false },
    { name: 'Blood Clots', selected: false },
    { name: 'Numbness', selected: false },
    { name: 'Sprains or Strains', selected: false },
  ];
  massageArea: any = [
    { name: 'Head', selected: false },
    { name: 'Neck', selected: false },
    { name: 'Face', selected: false },
    { name: 'Shoulder', selected: false },
    { name: 'Chest', selected: false },
    { name: 'Arms', selected: false },
    { name: 'Abdomen', selected: false },
    { name: 'Heads', selected: false },
    { name: 'Thigh', selected: false },
    { name: 'Back', selected: false },
    { name: 'Inner Thighs', selected: false },
    { name: 'Hips', selected: false },
  ];
  /* signature config */
  option: Object = {};
  serviceId: any;
  therapistId: any;
  locationId: any;
  loyaltyPointCanRedeem: any;
  loyaltyPointRecieve: any;
  signature: any;
  shopDetails: any;
  diseaseArray: any = [];
  discomfortArray: any = [];
  clientDetails: any;
  ownerId: any;
  loyalityPoint: any;
  servicePricingName: any;
  durationHour: any;
  durationMin: any;
  startDate: any;
  endDate: any;
  intakeId: any;
  ScreenWidth: any;
  ScreenHeight: any;
  currentDate: any;
  intakeData: any;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private active: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private httpService: ApiServicesService,
    private toasterService: ToasterService,
    private _validation: GlobalValidationService,
    private viewPortService: ViewPortService
  ) {
   }

  ngOnInit(): void {
    
    this.currentDate = new Date().toLocaleDateString()
    this.active.queryParams.subscribe((params)=>{
      this.durationHour= this.intakeFormData ? this.intakeFormData.durationHour : params.durationHour
      this.durationMin= this.intakeFormData ? this.intakeFormData.durationMin : params.durationMin
      this.startDate= this.intakeFormData ? this.intakeFormData.startDate : params.startDate
      this.endDate= this.intakeFormData ? this.intakeFormData.endDate : params.endDate
      this.servicePricingName= this.intakeFormData ? this.intakeFormData.servicePricingName : params.servicePricingName
      this.loyalityPoint= this.intakeFormData ? this.intakeFormData.loyalityPoint : params.loyalityPoint
      this.ownerId= this.intakeFormData ? this.intakeFormData.ownerId : params.ownerId
      this.loyaltyPointCanRedeem = this.intakeFormData ? this.intakeFormData.loyaltyPointCanRedeem : params['loyaltyPointCanRedeem'];
      this.loyaltyPointRecieve = this.intakeFormData ? this.intakeFormData.loyaltyPointRecieve : params['loyaltyPointRecieve'];
      this.shopName = this.intakeFormData ? this.intakeFormData.shopName : params.shopName,
      this.serviceName=  this.intakeFormData ? this.intakeFormData.serviceName : params.serviceName,
      this.serviceId=  this.intakeFormData ? this.intakeFormData.serviceId :params.serviceId,
      this.therapistId=  this.intakeFormData ? this.intakeFormData.therapistId : params.therapistId
      this.locationId=  this.intakeFormData ? this.intakeFormData.locationId : params.locationId
      this.serviceTime=  this.intakeFormData ? this.intakeFormData.serviceTime : params.serviceTime,
      this.servicePrice=  this.intakeFormData ? this.intakeFormData.servicePrice : params.servicePrice,
      this.therapistName= this.intakeFormData ? this.intakeFormData.therapistName : params.therapistName,
      this.timeSlot= this.intakeFormData ? this.intakeFormData.timeSlot : params.timeSlot
      if(params.formId) {
        this.getIntakeData(params.formId)
      }
    })

    this.shopDetails = JSON.parse(localStorage.getItem('shopSelected')!);
    this.clientDetails = this.getCookie('customerLogin') && JSON.parse(this.getCookie('customerLogin')!);
    if(!this.clientDetails) {this.router.navigateByUrl('auth/login');}
    this.stepper = new Stepper(document.querySelector('#stepper1') as any, {
      linear: true,
      animation: true,
    });

    this.intakeForm = this.fb.group({
      client_info: this.fb.group({
        personal: ['', Validators.required],
        firstName: ['', [Validators.required,Validators.pattern(this._validation.regex.name)]],
        lastName: [''],
        email: ['', [Validators.required,Validators.pattern(this._validation.regex.email)]],
        phone1: [''],
        gender: ['', Validators.required],
        dob: [''],
        // area: ['', Validators.required],
        // city: ['', [Validators.required,Validators.pattern(this._validation.regex.letter)]],
        // state: ['', [Validators.required,Validators.pattern(this._validation.regex.letter)]],
        // emergencyContactName: ['', [Validators.required,Validators.pattern(this._validation.regex.name)]],
        // emergencyContactRelation: ['', [Validators.required,Validators.pattern(this._validation.regex.name)]],
        // emergencyContactNo: ['', [Validators.required,Validators.pattern(this._validation.regex.number)]],
      }),
      medical_info: this.fb.group({
        medicationStatus: ['', Validators.required],
        medicationDetails: [''],
        pregnancyStatus: ['', Validators.required],
        pregnancyDuration: ['',],
        pregnancyRiskFactor: [''],
        chronicPainStatus: ['', Validators.required],
        chronicPainDetails: [''],
        chronicPainMakesBetter: [''],
        chronicPainMakesWorse: [''],
        orthoInjuriesStatus: ['', Validators.required],
        orthoInjuriesDetails: [''],
        diseases: ['', Validators.required],
        diseasesDescription: [''],
      }),
      massage_info: this.fb.group({
        therapist: ['', Validators.required],
        therapistGender: ['', Validators.required],
        priorMassage: ['', Validators.required],
        pressure: ['', Validators.required],
        allergiesStatus: ['', Validators.required],
        allergiesDetails: [''],
        avoidingAreasStatus: ['', Validators.required],
        avoidingAreasDetails: [''],
        not_massage: ['', Validators.required],
        client_sign: ['', Validators.required],
      }),
      ownerId: ['', Validators.required],
      type: ['', Validators.required],
    });
    
    this.intakeForm.valueChanges.subscribe(
      (value:any )=> {
        this.logValidationErrors()
      }
    );

  }
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    'canvasWidth': 470,
    'canvasHeight': 195
  };
  isLoading: boolean = true;
  getIntakeData(id) {
    this.httpService.get(`intake/${id}`).subscribe(res=>{
      this.intakeData = res;
      this.isLoading = false;
      console.log(res)
      const client_info = res.intake.client_info;
      let formatDate = moment(client_info.dob).format('YYYY-MM-DD')
      var [year, month, day] = formatDate.split(/[-,]+/).map(s => Number(s));
      let dob = { year, month, day };
      this.intakeForm.controls.client_info.controls['firstName'].setValue(client_info.firstName);
      this.intakeForm.controls.client_info.controls['lastName'].setValue(client_info.lastName);
      this.intakeForm.controls.client_info.controls['email'].setValue(client_info.email);
      this.intakeForm.controls.client_info.controls['phone1'].setValue(client_info.personal.phone1);
      this.intakeForm.controls.client_info.controls['gender'].setValue(client_info.gender);
      this.intakeForm.controls.client_info.controls['dob'].setValue(dob);
      this.intakeForm.controls.client_info.controls['dob'].setValue(dob);

      const medical_info = res.intake.medical_info;
      this.intakeForm.controls.medical_info.controls['medicationStatus'].setValue(medical_info.medicationStatus);
      this.intakeForm.controls.medical_info.controls['medicationDetails'].setValue(medical_info.medicationDetails);
      this.intakeForm.controls.medical_info.controls['pregnancyStatus'].setValue(medical_info.pregnancyStatus);
      this.intakeForm.controls.medical_info.controls['pregnancyDuration'].setValue(medical_info.pregnancyDuration);
      this.intakeForm.controls.medical_info.controls['pregnancyRiskFactor'].setValue(medical_info.pregnancyRiskFactor);
      this.intakeForm.controls.medical_info.controls['chronicPainStatus'].setValue(medical_info.chronicPainStatus);
      this.intakeForm.controls.medical_info.controls['chronicPainDetails'].setValue(medical_info.chronicPainDetails);
      this.intakeForm.controls.medical_info.controls['chronicPainMakesBetter'].setValue(medical_info.chronicPainMakesBetter);
      this.intakeForm.controls.medical_info.controls['chronicPainMakesWorse'].setValue(medical_info.chronicPainMakesWorse);
      this.intakeForm.controls.medical_info.controls['orthoInjuriesStatus'].setValue(medical_info.orthoInjuriesStatus);
      this.intakeForm.controls.medical_info.controls['orthoInjuriesDetails'].setValue(medical_info.orthoInjuriesDetails);
      this.intakeForm.controls.medical_info.controls['diseases'].setValue(medical_info.diseases);
      this.intakeForm.controls.medical_info.controls['diseasesDescription'].setValue(medical_info.diseasesDescription);
      const massage_info = res.intake.massage_info;
      this.intakeForm.controls.massage_info.controls['therapist'].setValue(massage_info.therapist);
      this.intakeForm.controls.massage_info.controls['therapistGender'].setValue(massage_info.therapistGender);
      this.intakeForm.controls.massage_info.controls['priorMassage'].setValue(massage_info.priorMassage);
      this.intakeForm.controls.massage_info.controls['pressure'].setValue(massage_info.pressure);
      this.intakeForm.controls.massage_info.controls['allergiesStatus'].setValue(massage_info.allergiesStatus);
      this.intakeForm.controls.massage_info.controls['allergiesDetails'].setValue(massage_info.allergiesDetails);
      this.intakeForm.controls.massage_info.controls['avoidingAreasStatus'].setValue(massage_info.avoidingAreasStatus);
      this.intakeForm.controls.massage_info.controls['avoidingAreasDetails'].setValue(massage_info.avoidingAreasDetails);
      this.intakeForm.controls.massage_info.controls['not_massage'].setValue(massage_info.not_massage);
      this.intakeForm.controls.massage_info.controls['client_sign'].setValue(massage_info.client_sign);
    })
  }
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  logValidationErrors() {
    this.formErrors = this._validation.getValidationErrors(this.intakeForm, this.validationMessages);
  }

  skipIntakeForm() {
    let queryData = {
      durationHour:this.durationHour,
      durationMin:this.durationMin,
      startDate:this.startDate,
      endDate:this.endDate,
      ownerId:this.ownerId,
      shopName:this.shopName,
      serviceName:this.serviceName,
      serviceTime:this.serviceTime,
      servicePrice:this.servicePrice,
      therapistName:this.therapistName,
      timeSlot:this.timeSlot,
      serviceId:this.serviceId,
     therapistId:this.therapistId,
     locationId:this.locationId,
     loyaltyPointCanRedeem:this.loyaltyPointCanRedeem,
     loyaltyPointRecieve:this.loyaltyPointRecieve,
     loyalityPoint:this.loyalityPoint,
     servicePricingName:this.servicePricingName,
     intakeId:this.intakeId
    }
  }

  onSubmit() {
    return false;
  }
  next() {
    this.stepper.next();
  }
  previous(step: any) {
    this.stepper.to(step);
  }

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  ngAfterViewInit() {
    console.log(this.signaturePad); // defined!
  }

  drawComplete(event: any) {
    var canvas: any = document.querySelector('canvas');
    this.signature = canvas.toDataURL();
    console.log(this.signature);
  }

  drawClear() {
    var canvas: any = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  drawStart() {}
  setDiseases(name: string, isChecked: boolean) {
    if (isChecked) {
      this.diseaseArray.push(name);
    } else {
      for (var i = 0; i < this.diseaseArray.length; i++) {
        if (this.diseaseArray[i] === name) {
          this.diseaseArray.splice(i, 1);
        }
      }
    } 
    console.log(  this.diseaseArray)
  }
  setDiscomfortArea(name: string, isChecked: boolean) {
    if (isChecked) {
      this.discomfortArray.push(name);
    } else {
      for (var i = 0; i < this.discomfortArray.length; i++) {
        if (this.discomfortArray[i] === name) {
          this.discomfortArray.splice(i, 1);
        }
      }
    } 
    console.log( this.discomfortArray)
  }
  submitForm() {
    if(this.signature === undefined) {
      this.toasterService.error('Please add your signature')
    } else {
      this.submit();
    }
  }
  submit() {
    if(this.intakeData.intake) {
      this.intakeForm.controls['type'].setValue(this.intakeData.intake.type);
      this.intakeForm.controls['ownerId'].setValue(this.intakeData.intake.ownerId);
    }
    this.intakeForm.controls.client_info.controls['personal'].setValue(this.clientDetails.client);
    this.intakeForm.controls.medical_info.controls['diseases'].setValue(
      this.diseaseArray
    );
    this.intakeForm.controls.massage_info.controls['not_massage'].setValue(
      this.discomfortArray
    );
    this.intakeForm.controls.massage_info.controls['client_sign'].setValue(this.signature);
    let dob = this.intakeForm.controls.client_info.controls['dob'].value;
    var finalDob: any;
    if(typeof dob === "string") {
      finalDob = dob;
    } else {
      finalDob = `${dob.year}-${dob.month}-${dob.day}`;
    }
    this.intakeForm.controls.client_info.controls['dob'].setValue(finalDob);
    let postBody = this.intakeForm.value;
    var URL = '';
    var METHOD = ''; 
    if(this.intakeData.intake) {
      URL = `intake/${this.intakeData.intake._id}`;
      METHOD = 'put'; 
    } else {
      URL = `intake`;
      METHOD = 'post'; 
    }
    this.httpService[METHOD](URL, postBody).subscribe(res=>{
     if(res.status === 200){
       console.log(res);
       this.intakeId=res.result._id
       console.log(this.intakeId);
      this.toasterService.success('Intake form has been submitted')
      setTimeout(() => {
        // this.skipIntakeForm() 
      }, 1000); 
     }
    });
  }
}
