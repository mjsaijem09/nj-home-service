import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntakeFormComponent } from './intake-form.component';

const route : Routes = [
  {
    path : '',
    component : IntakeFormComponent,
  },
];

@NgModule({
  declarations: [IntakeFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  exports: [IntakeFormComponent]
})

export class IntakeFormModule { }
