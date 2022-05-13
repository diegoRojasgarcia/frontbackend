import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulerComponent } from 'src/app/features/scheduling/components/scheduler/scheduler.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import { SharedModule } from 'src/app/shared/shared.module';
import { CCRAppointmentDialogComponent } from './components/ccr-appointment-dialog/ccr-appointment-dialog.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin
]);

@NgModule({
  declarations: [
    SchedulerComponent,
    CCRAppointmentDialogComponent
  ],
  imports: [
    CommonModule,
    FullCalendarModule,
    SharedModule
  ],
  exports: [SchedulerComponent]
})
export class SchedulingModule { }
