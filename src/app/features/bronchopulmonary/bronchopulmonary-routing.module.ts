import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBPMainComponent } from 'src/app/features/bronchopulmonary/pages/cbp-main/cbp-main.component';
import { CBPPatientListComponent } from './components/cbp-patient-list/cbp-patient-list.component';
import { CBPTrackingComponent } from './components/cbp-tracking/cbp-tracking.component';

const routes: Routes = [
  {
    path: "", component: CBPMainComponent, children: [
      { path: "", component: CBPTrackingComponent },
      { path: "tracking", component: CBPTrackingComponent },
      { path: "patients", component: CBPPatientListComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BronchopulmonaryRoutingModule { }
