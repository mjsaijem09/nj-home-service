import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NuSkinComponent } from './nu-skin.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RegisteredListComponent } from './registered-list/registered-list.component';

const route: Routes = [
  {
    path: '',
    component: NuSkinComponent,
  },
  {
    path: 'registration',
    component: RegistrationFormComponent,
  },
  {
    path: 'registered-list',
    component: RegisteredListComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [
    NuSkinComponent,
    RegistrationFormComponent,
    RegisteredListComponent,
  ],
  imports: [
    RouterModule.forChild(route),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class NuSkinModule {}
