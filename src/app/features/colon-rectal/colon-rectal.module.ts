import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColonRectalRoutingModule } from './colon-rectal-routing.module';
import { ColonRectalSummaryComponent } from './components/ccr-summary/ccr-summary.component';
import { ColonRectalReportsComponent } from './components/Reportabilidad/ccr-reports-component';

import { MATERIALS } from 'src/app/shared';
import { CCRMainComponent } from 'src/app/features/colon-rectal/pages/ccr-main/ccr-main.component';
import { CCRPatientListComponent } from 'src/app/features/colon-rectal/components/ccr-patient-list/ccr-patient-list.component';
import { PatientModule } from '../patient/patient.module';
import { CCRPatientComponent } from 'src/app/features/colon-rectal/components/ccr-patient/ccr-patient.component';
import { SchedulingModule } from '../scheduling/scheduling.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CCRPatientService } from './services/ccr-patient/ccr-patient.service';
import { CCRSchedulingService } from './services/ccr-scheduling/ccr-schedule.service';


@NgModule({
  declarations: [
    ColonRectalSummaryComponent,
    CCRMainComponent,
    CCRPatientListComponent,
    CCRPatientComponent,
    ColonRectalReportsComponent
  ],
  imports: [
    CommonModule,
    SchedulingModule,
    PatientModule,
    ColonRectalRoutingModule,
    SharedModule,
  ],
  providers:[
    CCRPatientService,
    CCRSchedulingService
  ]
})
export class ColonRectalModule { }
