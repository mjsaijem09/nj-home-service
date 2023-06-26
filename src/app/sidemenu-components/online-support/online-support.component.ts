import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router'
@Component({
  selector: 'app-online-support',
  templateUrl: './online-support.component.html',
  styleUrls: ['./online-support.component.scss']
})
export class OnlineSupportComponent implements OnInit {
 
  onlineSupportForm!:UntypedFormGroup
  submitted = false;

  constructor(private formBuilder: UntypedFormBuilder, private route : Router) { 
    this.onlineSupportForm = this.formBuilder.group({
      title:['', [Validators.required]],
      query:['', [Validators.required]],
    })
  }

  ngOnInit(): void {
  }

   // convenience getter for easy access to form fields
   get f() { return this.onlineSupportForm.controls; }

  onSubmit(){
    this.submitted = true;
  
    // stop here if form is invalid
    if (this.onlineSupportForm.invalid) {
      return;
    }

    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.onlineSupportForm.value))
  }
  }


