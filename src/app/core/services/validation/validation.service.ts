import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { clean, format, validate } from 'rut.js';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  private validate(rut: string): boolean {
    return validate(rut);
  }

  cleanRut(rut: string): string {
    return clean(rut);
  }

  formatRut(rut: string): string {
    return format(rut);
  }

  validateRut(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.validate(control.value) ? null : { invalidRut: { value: control.value } }
    }
  }

  // this works only to validate that a prev region is selected when residence time is less than 5 years
  validatePrevRegion(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const prevRef = control.get('previousRegion');
      return !!control.get('residenceTime')?.value ? null : (!!prevRef?.value ? null : { required: {value:true}})
    }
  }


}
