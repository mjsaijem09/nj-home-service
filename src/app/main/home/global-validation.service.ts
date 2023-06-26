import { Injectable } from '@angular/core';
import { UntypedFormGroup, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class GlobalValidationService {
  constructor() { }

  public regex = {
    email: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
    number: '^[0-9]*$',
    name: '^[a-zA-Z ]{2,30}$',
    letter: '^[a-zA-Z ]+$',
    date: '^\d{4}-\d{2}-\d{2}$',
  };

  getValidationErrors(group: UntypedFormGroup, validationMessages: Object | any): any {
    var formErrors: any = {};

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      formErrors[key] = '';
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)
      ) {
        const messages = validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof UntypedFormGroup) {
        let groupError = this.getValidationErrors(
          abstractControl,
          validationMessages
        );
        formErrors = { ...formErrors, ...groupError };
      }
    });
    return formErrors;
  }

  matchConfirmItems(controlName: string, confirmControlName: string) {
    return (formGroup: UntypedFormGroup) => {
      const control = formGroup.controls[controlName];
      const confirmControl = formGroup.controls[confirmControlName];

      if (!control || !confirmControl) {
        return null;
      }

      if (confirmControl.errors && !confirmControl.errors.mismatch) {
        return null;
      }

      if (control.value !== confirmControl.value) {
        confirmControl.setErrors({ mismatch: true });
      } else {
        confirmControl.setErrors(null);
      }
    };
  }
}
