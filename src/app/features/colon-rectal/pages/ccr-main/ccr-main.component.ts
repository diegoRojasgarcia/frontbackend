import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventApi } from '@fullcalendar/angular';
import { CCRConstants } from 'src/app/core/constants/ccr.constants';
import { CCREnrollmentSurvey } from 'src/app/features/colon-rectal/models/ccr-enrollment-survey';
import { CCREnrollmentSchedule } from 'src/app/features/colon-rectal/models/ccr-schedule';
import { Patient } from 'src/app/features/patient/models/patient';
import { Features, Permission } from 'src/app/features/users-management/models/privilege';
import { ScreeningSurveyQuestion } from 'src/app/core/models/ScreeningSurveyQuestion';
import { AdministrativeService } from 'src/app/core/services/administrative/administrative.service';
import { CCRPatientService } from 'src/app/features/colon-rectal/services/ccr-patient/ccr-patient.service';
import { CCRSchedulingService } from 'src/app/features/colon-rectal/services/ccr-scheduling/ccr-schedule.service';
import { DateTimeService } from 'src/app/core/services/date-time/date-time.service';
import { PatientService } from 'src/app/features/patient/services/patient.service';
import { CCRAppointmentDialogComponent } from '../../../scheduling/components/ccr-appointment-dialog/ccr-appointment-dialog.component';
import { PatientProfileComponent } from '../../../patient/components/patient-profile/patient-profile.component';
import { PatientRegisterComponent } from '../../../patient/components/patient-register/patient-register.component';
import { SchedulerComponent } from '../../../scheduling/components/scheduler/scheduler.component';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

interface TabItem {
  name: string,
  patientId: number,
  index: number,
  surveyForm: FormGroup
}
@Component({
  selector: 'app-colon-rectal-tabs',
  templateUrl: './ccr-main.component.html',
  styleUrls: ['./ccr-main.component.css']
})
export class CCRMainComponent implements OnInit, OnDestroy {
  private subs$ = new Subscription();

  FEATURES = Features;
  PERMISSIONS = Permission;

  @ViewChild(PatientRegisterComponent) register!: PatientRegisterComponent;
  @ViewChild(SchedulerComponent) scheduler!: SchedulerComponent;
  @ViewChild(PatientProfileComponent) basicPatientProfile!: PatientProfileComponent;

  currentCancer: string = AppConstants.CCR_NAME;
  currentCancerKey: string = AppConstants.CCR_KEY;
  currentAgeRange: string = CCRConstants.ageRange;

  survey!: ScreeningSurveyQuestion[];
  currentSurvey!: CCREnrollmentSurvey | undefined;

  scheduledEvents: CCREnrollmentSchedule[] = [];
  scheduledEventsRef: CCREnrollmentSchedule[] = [];
  currentTimeRange!: Interval[];
  loadedRanges: Interval[] = []

  showPatientProfile: boolean = false;
  currentPatientName: string = "Desconocido";
  currentPatientId!: number;
  selectedIndex: number = 0;
  patientTabs: TabItem[] = []
  lock: boolean = false;

  constructor(private patientService: PatientService, private ccrService: CCRPatientService, private admin: AdministrativeService, private schedulingService: CCRSchedulingService, private eventDialog: MatDialog, private dtService: DateTimeService) { }

  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }

  ngOnInit(): void {
    this.subs$.add(this.admin.getCCRSurvey().subscribe(res => {
      this.survey = res.data;
    }))
  }

  /**
   * Adds a new patient
   * 
   * Calls the Patient service to make a POST request to the server with
   * the new patient information.
   * 
   * @param patient   The patient information.
   */
  addPatient(patient: Patient): void {
    this.subs$.add(this.patientService.addPatient(patient).subscribe(res => {
      this.register.patientId = res.data[0].idPatient;
      this.register.stepper.next();

    }))
  }

  /**
   * Adds a new patient enrollment survey in the current cancer program.
   * 
   * Calls the ccr service to make a POST request to the server with the new survey
   * data.
   * 
   * @param survey 
   */
  addEnrollmentSurvey(survey: CCREnrollmentSurvey): void {
    this.subs$.add(this.ccrService.registerEnrollmentSurvey(survey).subscribe(res => {
      this.register.final = res.msg;
      this.register.stepper.next();
    }))
  }

  /**
   * Handles the patient profile opening.
   * 
   * If no profile is currently open, adds a new tab with the selected profile,
   * otherwise replace the current tab with a new one, or if the selected
   * patient profile is already open, focus the view on the respective profile.
   * Only one profile can be open at a time.
   * @param patientId 
   */
  openPatientProfile(patientId: number) {
    this.currentPatientId = patientId;
    this.currentPatientName = "Paciente N" + patientId;
    const patient = this.patientTabs.find(e => e.patientId == this.currentPatientId)
    if (patient) {
      this.selectedIndex = patient.index
    } else {
      this.subs$.add(this.ccrService.getPatientEnrollmentSurvey(patientId).subscribe(res => {
        const surveyForm = this.addSurveyInstance();
        this.currentSurvey = res.data[0]
        const currentPatient: TabItem = { name: this.currentPatientName, patientId: this.currentPatientId, index: 5, surveyForm: surveyForm }

        if (this.currentSurvey)
          currentPatient.surveyForm.setValue({
            idPatient: this.currentSurvey.idPatient,
            bleedingInStools: this.currentSurvey.bleedingInStools,
            alterationOfBowelHabits: this.currentSurvey.alterationOfBowelHabits,
            abdominalPain: this.currentSurvey.abdominalPain,
            weightLoss: this.currentSurvey.weightLoss,
            caColonRectum: this.currentSurvey.caColonRectum,
            colonoscopy: this.currentSurvey.colonoscopy,
            colitis: this.currentSurvey.colitis,
            crohn: this.currentSurvey.crohn,
          })
        this.patientTabs.pop();
        this.selectedIndex = this.patientTabs.push(currentPatient) + 4;

      }))
    }
  }
  
  /**
   * Handles the profile closing by user interaction.
   * 
   * If no changes has been made, deletes the tab and focus on the patient list tab,
   * if changes has been made, triggers a confirmation dialog asking for confirmation
   * before closing, if user confirms, closes the tab without saving, otherwise the
   * tab stays open until changes are saved or the user tries to close the tab again.
   */
  closeProfile(): void {
    const obs = this.basicPatientProfile.closeProfile();
    if (obs)
      this.subs$.add(obs.subscribe(res => {
        if (res.response) {
          this.basicPatientProfile.updateData();
          this.patientTabs.pop()
        } else
          this.selectedIndex = 5
      }))
    else {
      this.patientTabs.pop()
    }
  }
  updateCCREnrollmentSurvey(data: CCREnrollmentSurvey): void {
    this.subs$.add(this.ccrService.updateEnrollmentSurvey(data).subscribe());
  }

  loadEnrollmentAppointments(timeRange: Interval[]): void {
    this.currentTimeRange = timeRange;
    this.subs$.add(this.schedulingService.getScheduleRange(timeRange).subscribe(res => {
      this.scheduledEvents = res;
    }))
  }

  addEnrollmentAppointment(event: Date): void {
    const config = this.createBaseDialogConfig();
    config.data = {
      start: event,
    }
    const diaRef = this.eventDialog.open(CCRAppointmentDialogComponent, config);
    let appointment: CCREnrollmentSchedule;
    this.subs$.add(diaRef.afterClosed().pipe(mergeMap(res => {
      if (res) {
        appointment = res.data
        return this.schedulingService.addAppointment(res.data)
      } else
        return new Observable<false>()
    })).subscribe(res => {
      if (res) {
        appointment.idSchedule = res.data[0].idSchedule;
        this.scheduledEvents = this.scheduledEvents.concat(appointment);
      }
    }))
  }

  editEnrollmentAppointment(event: EventApi): void {
    const config = this.createBaseDialogConfig();
    config.data = event
    const diaRef = this.eventDialog.open(CCRAppointmentDialogComponent, config);
    let appointment: CCREnrollmentSchedule;
    diaRef.afterClosed().pipe(mergeMap(res => {
      if (res) {
        appointment= res.data
        return this.schedulingService.updateAppointment(res.data)
      }else
        return new Observable<false>();
    })).subscribe(res=>{
      if (res) {
        const dataRef = this.scheduledEvents.filter(e => e.idSchedule !== appointment.idSchedule)
        dataRef.push(appointment);
        this.scheduledEvents = dataRef;
      }
    })
  }

  updateEvent(event: EventApi): void {
    const data: CCREnrollmentSchedule = {
      idSchedule: event.extendedProps.idSchedule,
      title: event.title,
      cancer: event.extendedProps.cancer,
      start: event.start ?? new Date(),
      end: event.end ?? new Date(),
      patients: event.extendedProps.patients,
      location: event.extendedProps.location
    }

    this.subs$.add(this.schedulingService.updateAppointment(data).subscribe());
  }

  refreshCalendar(): void {
    this.schedulingService.clearCache();
    this.subs$.unsubscribe()
    this.subs$ = new Subscription();
    this.loadEnrollmentAppointments(this.currentTimeRange);
  }

  private addSurveyInstance(): FormGroup {
    return new FormGroup({
      idPatient: new FormControl(),
      bleedingInStools: new FormControl(),
      alterationOfBowelHabits: new FormControl(),
      abdominalPain: new FormControl(),
      weightLoss: new FormControl(),
      caColonRectum: new FormControl(),
      colonoscopy: new FormControl(),
      colitis: new FormControl(),
      crohn: new FormControl(),
    })
  }

  private createBaseDialogConfig(): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '500px';
    return dialogConfig;
  }
}

