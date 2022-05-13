import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BronchopulmonaryRoutingModule } from './bronchopulmonary-routing.module';
import { CBPMainComponent } from 'src/app/features/bronchopulmonary/pages/cbp-main/cbp-main.component';
import { SchedulingModule } from '../scheduling/scheduling.module';
import { PatientModule } from '../patient/patient.module';
import { CBPPatientComponent } from 'src/app/features/bronchopulmonary/components/cbp-patient/cbp-patient.component';
import { CBPTrackingComponent } from 'src/app/features/bronchopulmonary/components/cbp-tracking/cbp-tracking.component';
import { CBPPatientListComponent } from 'src/app/features/bronchopulmonary/components/cbp-patient-list/cbp-patient-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CBPPatientService } from './services/cbp-patient/cbp-patient.service';
import { CBPSchedulingService } from './services/cbp-scheduling/cbp-scheduling.service';


@NgModule({
  declarations: [
    CBPMainComponent,
    CBPPatientComponent,
    CBPTrackingComponent,
    CBPPatientListComponent
  ],
  imports: [
    CommonModule,
    BronchopulmonaryRoutingModule,
    SchedulingModule,
    PatientModule,
    SharedModule
  ],
  providers:[
    CBPPatientService,
    CBPSchedulingService
  ]
})
export class BronchopulmonaryModule { }
