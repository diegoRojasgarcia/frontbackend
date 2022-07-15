import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventApi } from '@fullcalendar/angular';
import { CBPConstants } from 'src/app/core/constants/cbp-constants';
import { CBPEnrollmentSurvey } from 'src/app/features/bronchopulmonary/models/cbp-enrollment-survey';
import { CBPEnrollmentSchedule } from 'src/app/features/bronchopulmonary/models/cbp-tracking';
import { Patient } from 'src/app/features/patient/models/patient';
import { Features, Permission } from 'src/app/features/users-management/models/privilege';
import { ScreeningSurveyQuestion } from 'src/app/core/models/ScreeningSurveyQuestion';
import { AdministrativeService } from 'src/app/core/services/administrative/administrative.service';
import { CBPPatientService } from 'src/app/features/bronchopulmonary/services/cbp-patient/cbp-patient.service';
import { CBPSchedulingService } from 'src/app/features/bronchopulmonary/services/cbp-scheduling/cbp-scheduling.service';
import { PatientService } from 'src/app/features/patient/services/patient.service';
import { CCRAppointmentDialogComponent } from '../../../scheduling/components/ccr-appointment-dialog/ccr-appointment-dialog.component';
import { PatientProfileComponent } from '../../../patient/components/patient-profile/patient-profile.component';
import { PatientRegisterComponent } from '../../../patient/components/patient-register/patient-register.component';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CCREnrollmentSchedule } from 'src/app/features/colon-rectal/models/ccr-schedule';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cbp-main',
  templateUrl: './cbp-main.component.html',
  styleUrls: ['./cbp-main.component.css']
})
export class CBPMainComponent implements OnInit, OnDestroy {
  private subs$ = new Subscription()

  FEATURES = Features
  PERMISSIONS = Permission

  @ViewChild(PatientRegisterComponent) register!: PatientRegisterComponent;
  @ViewChild(PatientProfileComponent) basePatientProfile!: PatientProfileComponent;

  events: CBPEnrollmentSchedule[] = [];

  currentCancer = AppConstants.CBP_NAME;
  currentSchedulerEnd = "17:00:00";
  currentTimeRange!: Interval[];
  loadedRanges: Interval[] = [];
  currentRange!: Interval[];

  currentSurvey: ScreeningSurveyQuestion[] = [];
  currentAgeRange: string = CBPConstants.AGE_RANGE
  currentCancerKey: string = AppConstants.CBP_KEY
  currentPatientId!: number;
  currentPatientName!: string;

  patientTabs: TabItem[] = []
  selectedIndex: number = 0

  lock: boolean = false;

  constructor(private admin: AdministrativeService, private patientService: PatientService, private cbpService: CBPPatientService, private scheduler: CBPSchedulingService, private eventDialog: MatDialog, private router:Router) { }
  ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }

  ngOnInit(): void {
    this.subs$.add(this.admin.getCBPSurvey().subscribe(res => {
      this.currentSurvey = res.data;
    }))
  }

  /**
   * Call tha patient service to send a POST request to add a new patient
   * 
   * @param patient   The patient data to be stored in the server
   */
  addPatient(patient: Patient): void {
    this.subs$.add(this.patientService.addPatient(patient).subscribe(res => {
      this.register.patientId = res.data[0].idPatient;
      this.register.stepper.next();

    }))
  }

  /**
   * Calls the CBP service to send a POST request to add a new patient enrollment survey
   * 
   * @param survey  The new survey data to be stored in the server.
   */
  addEnrollmentSurvey(survey: CBPEnrollmentSurvey): void {
    this.subs$.add(this.cbpService.registerEnrollmentSurvey(survey).subscribe(res => {
      this.register.final = res.msg;
      this.register.stepper.next();
    }))
  }

  /**
   * Open a new patient profile tab by user interaction
   * 
   * The user select a patient to see it's detail in a new tab. Only one
   * can be opened at a time.
   * 
   * @param patientId   The id of the patient.
   */
  openPatientProfile(patientId: number) {
    this.currentPatientId = patientId;
    this.currentPatientName = "Paciente N" + patientId;
    const patient = this.patientTabs.find(e => e.patientId == this.currentPatientId)
    if (patient) {
      this.selectedIndex = patient.index
    } else {
      this.subs$.add(this.cbpService.getEnrollmentSurvey(patientId).subscribe(res => {
        const surveyForm = this.addSurveyInstance();
        const surveyData = res.data[0]
        const currentPatient: TabItem = { name: this.currentPatientName, patientId: this.currentPatientId, index: 5, surveyForm: surveyForm }

        if (surveyData)
          currentPatient.surveyForm.setValue({
            idPatient: surveyData.idPatient,
            ipa10: surveyData.ipa10,
            smokerIpa20: surveyData.smokerIpa20,
            exSmokerIpa2015years: surveyData.exSmokerIpa2015years,
            historyLungCancer: surveyData.historyLungCancer,
            familyHistoryLungCancer: surveyData.familyHistoryLungCancer,
            arsenicAsbestosExposure: surveyData.arsenicAsbestosExposure,
            riskProfession: surveyData.riskProfession,
            antofagastaResidenceOver5Years: surveyData.antofagastaResidenceOver5Years,
            emphysemaFibrosis: surveyData.emphysemaFibrosis,
          })
        this.patientTabs.pop();
        this.selectedIndex = this.patientTabs.push(currentPatient) + 4;
      }))
    }
  }

  /**
   * Handles the closing of an opened patient profile.
   * 
   * Tis function is called by user interaction and is restricted
   * in case there's unsaved changes to the profile.
   */
  closeProfile(): void {
    const obs = this.basePatientProfile.closeProfile();
    if (obs)
      this.subs$.add(obs.subscribe(res => {
        if (res.response) {
          this.patientTabs.pop()
        } else
          this.selectedIndex = 5
      }))
    else {
      this.patientTabs.pop()
    }
  }

  /**
   * Calls the CBP service to make a PUT request to update an existing Survey
   * 
   * @param data  The new data to be updated.
   */
  updateCCREnrollmentSurvey(data: CBPEnrollmentSurvey): void {
    this.subs$.add(this.cbpService.updateEnrollmentSurvey(data).subscribe())
  }

  /**
   * Creates a new CBP survay form instance
   * 
   * Dummy function to call every time a new instance of enrollment survey form is required.
   * 
   * @returns The new FormGroup object
   */
  addSurveyInstance(): FormGroup {
    return new FormGroup({
      idPatient: new FormControl(),
      ipa10: new FormControl(),
      smokerIpa20: new FormControl(),
      exSmokerIpa2015years: new FormControl(),
      historyLungCancer: new FormControl(),
      familyHistoryLungCancer: new FormControl(),
      arsenicAsbestosExposure: new FormControl(),
      riskProfession: new FormControl(),
      antofagastaResidenceOver5Years: new FormControl(),
      emphysemaFibrosis: new FormControl(),
    })
  }

  // scheduler related functions
  /**
   * Handles the creation of a new appointment.
   * 
   * Creates a new dialog to confirm the details of a new appointment, then
   * ask for confirmation. If gets a positive answer, calls the scheduler service
   * to make a POST request adding the new appointment data to the server, otherwise,
   * closes the dialog without saving. This behavior can be modified from constants (please verify).
   * 
   * @param date  The date of the appointment selected by the user.
   */
  addEnrollmentAppointment(date: Date) {
    const config = this.createBaseDialogConfig();
    config.data = {
      start: date,
      cancer: "Cáncer broncopulmonar"
    }
    const diaRef = this.eventDialog.open(CCRAppointmentDialogComponent, config);
    let appointment: CCREnrollmentSchedule;
    this.subs$.add(diaRef.afterClosed().pipe(mergeMap(res => {
      if (res) {
        appointment = res.data;
        return this.scheduler.addAppointment(res.data)
      } else
        return new Observable<false>()
    })).subscribe(res => {
      if (res) {
        appointment.idSchedule = res.data[0].idSchedule;
        this.events = this.events.concat(appointment);
      }
    }));
  }

  /**
   * Updates the date of an existing event in the calendar
   * 
   * This method is onnly triggered by drag & drop.
   * 
   * @param event   The new data to be modified.
   */
  updateEvent(event: EventApi): void {
    const data: CBPEnrollmentSchedule = {
      idSchedule: event.extendedProps.idSchedule,
      title: event.title,
      cancer: event.extendedProps.cancer,
      start: event.start ?? new Date(),
      end: event.end ?? new Date(),
      patients: event.extendedProps.patients,
      location: event.extendedProps.location
    }

    this.subs$.add(this.scheduler.updateAppointment(data).subscribe());
  }

  /**
   * Edits the details of an existing appointment in the calendar.
   * 
   * On event click, open an appointment dialog containing the respective appointment data,
   * the user has the ability to change any of the allowed fields in the appointment. Then
   * ask for confirmation, if gets a positive answer, the scheduler service is called to make a
   * PUT request with the new information otherwise, closes the dialog without saving.
   * 
   * @param event   The event data to be edited.
   */
  editEnrollmentAppointment(event: EventApi): void {
    const config = this.createBaseDialogConfig();
    config.data = event
    const diaRef = this.eventDialog.open(CCRAppointmentDialogComponent, config);
    let appointment: CCREnrollmentSchedule;
    this.subs$.add(diaRef.afterClosed().pipe(mergeMap(res => {
      if (res) {
        appointment = res.data;
        return this.scheduler.updateAppointment(res.data)
      } else
        return new Observable<false>();
    })).subscribe(res => {
      if (res) {
        const dataRef = this.events.filter(e => e.idSchedule !== appointment.idSchedule)
        dataRef.push(appointment)
        this.events = dataRef
      }
    }))
  }

  /**
   * Handles the event loading of the calendar.
   * 
   * Load the events in the given time range. The range size and behavior can be modified
   * from global constants (please verify the correct operation before commiting a change).
   * 
   * @param timeRange   The time range to be search upon.
   */
  loadEnrollmentAppointments(timeRange: Interval[]): void {
    this.currentTimeRange = timeRange;
    this.subs$.add(this.scheduler.getScheduleRange(timeRange).subscribe(res => {
      this.events = res;
    }))
  }

  /**
   * Refreshes the calendar's cache upon user interaction.
   */
  refreshCalendar(): void {
    this.scheduler.clearCache();
    this.subs$.unsubscribe()
    this.subs$ = new Subscription()
    this.loadEnrollmentAppointments(this.currentTimeRange);
  }

  private createBaseDialogConfig(): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '500px';
    return dialogConfig;
  }
}

interface TabItem {
  name: string;
  patientId: number;
  index: number;
  surveyForm: FormGroup;
}
