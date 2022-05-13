import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientProfileComponent } from 'src/app/features/patient/components/patient-profile/patient-profile.component';
import { PatientRegisterComponent } from 'src/app/features/patient/components/patient-register/patient-register.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PatientService } from './services/patient.service';


@NgModule({
  declarations: [
    PatientProfileComponent,
    PatientRegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PatientProfileComponent,
    PatientRegisterComponent
  ], providers: [
    PatientService
  ]
})
export class PatientModule { }
