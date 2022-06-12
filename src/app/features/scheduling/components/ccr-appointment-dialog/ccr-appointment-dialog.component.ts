import { animate, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CCREnrollmentPatientSchedule } from 'src/app/features/colon-rectal/models/patient-schedule';
import { Schedule } from 'src/app/features/scheduling/models/schedule';
import { DateTimeService } from 'src/app/core/services/date-time/date-time.service';
import { ValidationService } from 'src/app/core/services/validation/validation.service';


@Component({
  selector: 'app-ccr-appointment-dialog',
  templateUrl: './ccr-appointment-dialog.component.html',
  styleUrls: ['./ccr-appointment-dialog.component.css'],
  animations: [
    trigger('collapseForm', [
      transition(':enter', [style({ height: 0 }), animate(270)]),
      transition(':leave', [animate(270, style({ height: 0 }))]),
    ]),
  ],
})

export class CCRAppointmentDialogComponent implements OnInit {

  dialogTitle: string;
  patientForm: FormGroup;
  patients: CCREnrollmentPatientSchedule[] = [];
  appointmentForm: FormGroup;

  //for formatting
  start: FormControl;
  endAppointment: FormControl;
  backdrop: boolean = false;
  currentDate: Date;
  panelOpen: boolean = false;
  showPatient = false;
  collapse: any;
  constructor(private diaRef: MatDialogRef<CCRAppointmentDialogComponent>, @Inject(MAT_DIALOG_DATA) data: AppointmentData, private DTService: DateTimeService, private valSvc: ValidationService) {

    // appintment form
    this.start = new FormControl();
    this.endAppointment = new FormControl();
    this.appointmentForm = new FormGroup({
      idSchedule: new FormControl(),
      cancer: new FormControl({ value: "Cáncer colorectal", disabled: true }),
      title: new FormControl({ value: "enrolamiento", disabled: true }),
      patients: new FormControl(this.patients),
      start: this.start,
      location: new FormControl(),
      end: this.endAppointment
    }, {validators: this.validRange.bind(this)})
    this.patientForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      age: new FormControl("", [Validators.required]),
      rut: new FormControl("", [Validators.required]),
      id_schedule_patient: new FormControl()
    })
    this.currentDate = data.start;
    this.dialogTitle = data.title ?? "Nueva Cita";

    if (data.extendedProps) {
      const extRef = data.extendedProps;
      this.patients = Object.assign([{}], extRef.patients);

      // when the patient list is empty, backend return a list with an empty object
      // this part deals with it
      const firstRef = this.patients.pop()
      console.log(firstRef);
      if(!!firstRef?.id_schedule_patient)
        this.patients.push(firstRef)
        
      this.appointmentForm.setValue({
        idSchedule: extRef.idSchedule,
        cancer: extRef.cancer,
        patients: this.patients,
        start: DTService.format(data.start),
        location: extRef.location,
        end: DTService.format(data.end),
        title: data.title
      })
    }
    else {
      this.appointmentForm.get("end")?.setValue(DTService.format(DTService.add(this.currentDate, { minutes: 30 })));
      this.appointmentForm.get("start")?.setValue(DTService.format(this.currentDate));
      data.cancer ? this.appointmentForm.get("cancer")?.setValue(data.cancer) : this.appointmentForm.get("cancer")?.setValue("Cáncer colorectal");
      data.title ? this.appointmentForm.get("title")?.setValue(data.title) : this.appointmentForm.get("title")?.setValue("enrolamiento");
    }
  }

  ngOnInit(): void {
  }

  close(): void {
    this.diaRef.close();
  }

  save(): void {
    this.diaRef.close({
      data: {
        idSchedule: this.appointmentForm.get('idSchedule')?.value,
        start: this.DTService.parseISO(this.appointmentForm.get('start')?.value),
        end: this.DTService.parseISO(this.appointmentForm.get('end')?.value),
        title: this.appointmentForm.get('title')?.value,
        location: this.appointmentForm.get('location')?.value,
        patients: this.patients,
        cancer: this.appointmentForm.get('cancer')?.value,
      }
    });
  }
  showPatientForm(value: CCREnrollmentPatientSchedule | string): void {
    this.showPatient = true;
    if (value && typeof value != "string")
      this.patientForm.setValue(value);
  }
  hidePatientForm(event: boolean | string): void {
    if (event) {
      this.showPatient = false;
      this.patientForm.reset();
    }
  }

  addPatient(): void {
    const idKey ="id_schedule_patient"
    const id = this.patientForm.get(idKey)?.value
    if (!id) {
      this.patientForm.get(idKey)?.setValue(this.patients.length+1)
      this.patients.push(this.patientForm.value)
    }
    else {
      this.patients = this.patients.map(e => e.id_schedule_patient !== id ? e : this.patientForm.value)
    }
    this.patientForm.reset()
    this.showPatient = false;
  }

  removePatient(): void {
    const idRef = this.patientForm.get("id_schedule_patient")?.value
    this.patients = this.patients.filter(e => e.id_schedule_patient != idRef)
    this.patientForm.reset()
    this.showPatient = false;
  }

  getStatusColor(): string {
    const l = this.patients.length
    return l > 6 ? 'red' : l < 6 && l > 4 ? '#ffbb2f' : l > 0 && l < 5 ? 'green' : 'black';
  }

  formatRut():void{
    const ctrlRef =this.patientForm.get('rut');
    ctrlRef?.setValue(this.valSvc.formatRut(ctrlRef.value));
  }

  private validRange(control: AbstractControl): ValidationErrors | null {
    const start = control.get('start');
    const end = control.get('end');
  
    return start && end && this.DTService.compareDates(this.DTService.parseISO(end.value),this.DTService.parseISO(start.value))<0 ? { badRange: true } : null;
  };
}

interface ExtendedProps extends Schedule {
  patients: any[],
  location: string,
}
interface AppointmentData {
  start: Date,
  end: Date,
  title?: string,
  cancer?: string,
  extendedProps?: ExtendedProps
}

