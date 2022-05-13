import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { CancerCheck, Patient } from 'src/app/features/patient/models/patient';
import { Region } from 'src/app/core/models/region';
import { ScreeningSurveyQuestion } from 'src/app/core/models/ScreeningSurveyQuestion';
import { AdministrativeService } from 'src/app/core/services/administrative/administrative.service';
import { PatientService } from 'src/app/features/patient/services/patient.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ValidationService } from 'src/app/core/services/validation/validation.service';
import { Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-patient-register',
  templateUrl: './patient-register.component.html',
  styleUrls: ['./patient-register.component.css']
})

export class PatientRegisterComponent implements OnInit, OnChanges, OnDestroy {
  private subs$: Subscription = new Subscription();

  @ViewChild(MatStepper) stepper!: MatStepper;
  // patient
  @Input() ageRange: string = "";
  @Input() cancer: string = "";
  @Input() cancerKey: string = "";
  @Output() patientSubmit: EventEmitter<Patient> = new EventEmitter<Patient>();

  // survey
  @Input() survey: ScreeningSurveyQuestion[] = [];
  @Output() surveySubmit: EventEmitter<any> = new EventEmitter<any>();

  // patient profile
  @Output() openProfile: EventEmitter<number> = new EventEmitter<number>();


  patientId!: number;
  isEditable: boolean = true;
  communesLoading: boolean = false;
  showOptionalRegion: boolean = false;
  showError: boolean = false;

  hint: string = "Verifique si existen datos antes de empezar";
  final: string | undefined = "Esperando respuesta del servidor...";
  requiredField: string = AppConstants.ERROR_REQUIRED;
  patientData: FormGroup;
  patientRUT: FormControl;
  residenceTime: FormControl;

  enrollmentSurvey: FormGroup;

  regions: Region[] = [];
  communes: Region[] = [];
  cesfamList: string[] = [];
  nationalities: string[] = [];
  fonasa: string[] = [];
  mStates: string[] = [];

  constructor(private patientService: PatientService, private admin: AdministrativeService, private confirmDialog: MatDialog, private valSvc: ValidationService) {
    this.patientRUT = new FormControl(null, [Validators.required]);
    this.residenceTime = new FormControl(null, [Validators.required]),
      this.patientData = new FormGroup({
        name: new FormControl(null, [Validators.required]),
        lastName: new FormControl(null, [Validators.required]),
        lastName2: new FormControl(),
        nationality: new FormControl(null, [Validators.required]),
        rut: this.patientRUT,
        birthday: new FormControl(null, [Validators.required]),
        maritalState: new FormControl(),
        sex: new FormControl(null, [Validators.required]),
        region: new FormControl(null, [Validators.required]),
        commune: new FormControl(null, [Validators.required]),
        address: new FormControl(null, [Validators.required]),
        village: new FormControl(),
        residenceTime: this.residenceTime,
        previousRegion: new FormControl(),
        cesfam: new FormControl(),
        medicalFacility: new FormControl(),
        cellphone: new FormControl(null, [Validators.pattern(AppConstants.phoneNumberPattern), Validators.required]),
        emergencyPhone: new FormControl(null, [Validators.pattern(AppConstants.phoneNumberPattern)]),
        mail: new FormControl(null, [Validators.pattern(AppConstants.emailPattern)]),
        fonasa: new FormControl(null, Validators.required),
        inAgeRange: new FormControl(null, [Validators.requiredTrue]),
        dataAgreement: new FormControl(null, [Validators.requiredTrue]),
        volunteerAgreement: new FormControl(null, [Validators.requiredTrue])
      }, [valSvc.validatePrevRegion()])
    this.enrollmentSurvey = new FormGroup({})


  }
  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.survey) {
      for (let question of this.survey)
        this.enrollmentSurvey.addControl(question.name, new FormControl())
    }
  }

  ngOnInit() {
    this.subs$.add(this.admin.getPatientSelectData().subscribe(res => {
      this.regions = res.regions;
      this.cesfamList = res.cesfams;
      this.nationalities = res.nationalities;
      this.fonasa = res.fonasa;
      this.mStates = res.maritalStates;
    }));
  }

  /**
   * Verify requested RUT/DNI is already stored in the server.
   * <p>
   * The requirement handles the folowing cases:
   * <ul>
   * <li>In case the identity is completly new, proceed with the normal process flow.
   * <li>In case the identity is not new, but does not belong to the current cancer program yet, proceeds to the next enrollment step.
   * <li>In the case the identity is not new, and is alredy registered in the current cancer program, interrupts the enrollment process and allows the user to visit the respective patient profile or try a new patient.
   * </ul>
   * 
   */
  public lookupPatient() {
    const rut = this.patientRUT.value;
    if (!!rut)
      this.subs$.add(this.patientService.getPatientCancerByRUT(rut).pipe(mergeMap(res => {
        const patientCancer = res.data[0];
        if (patientCancer && this.checkPatientInCancer(patientCancer)) {
          this.patientId = patientCancer.idPatient
          const dialogConfig = new MatDialogConfig();
          dialogConfig.hasBackdrop = true;
          dialogConfig.disableClose = true;
          dialogConfig.maxWidth = '400px';
          dialogConfig.data = {
            title: "Paciente ya registrado",
            action: "Ir al perfil",
            msg: "El paciente ya se encuentra registrado en la sección " + this.cancer + " de la plataforma.\n" +
              "Si desea modificar/agregar datos, por favor dirigirse al perfil del paciente."
          }
          const diaRef = this.confirmDialog.open(ConfirmDialogComponent, dialogConfig);
          return diaRef.afterClosed()
        }
        else if (patientCancer) {
          this.patientId = patientCancer.idPatient
          return this.patientService.getPatient(this.patientId)
        } else
          return new Observable<true>();
      })).subscribe(res => {
        if (res.response)
          this.openProfile.emit(this.patientId)
        else if (res.data) {
          this.isEditable = false;
          const patient = res.data[0];
          this.setPatientData(patient);
          this.disableForm();
        }
        else
          this.resetSteps();
      }))
  }

  /**
   * If conditions are met, emits new patient data to be handle by parent component, or skip to the next step.
   */
  public submitPatient(): void {
    if (this.isEditable && this.patientData.valid) {
      this.patientSubmit.emit(this.patientData.value);
    }
    else {
      this.stepper.next()
      if (!this.patientData.valid)
        this.showError = true
    }

  }

  /**
   * Emits enrollment survey data to be handled by a parent component.
   */
  public submitEnrollment(): void {
    this.enrollmentSurvey.addControl("idPatient", new FormControl(this.patientId))
    this.surveySubmit.emit(this.enrollmentSurvey.value);
  }

  //utilities

  public getCommunes(): void {
    this.communesLoading = true;
    this.communes = [];
    this.subs$.add(this.admin.getCommuneByRegion(this.patientData.get('region')?.value).subscribe(res => {
      this.communes = res.data;
      this.communesLoading = false;
    }))
  }

  public checkOptionalRegion(value: boolean): void {
    const prevRef = this.patientData.get("previousRegion");
    if (!value) {
      this.showOptionalRegion = true;
      prevRef?.addValidators(Validators.required);
    } else {
      this.showOptionalRegion = false;
      prevRef?.reset();
      prevRef?.removeValidators(Validators.required);
    }
  }

  public resetSteps(): void {
    this.patientData.reset();
    this.stepper.reset();
    this.enableForm();
    this.isEditable = true;
    this.showError = false;
  }


  //private utilities
  private disableForm(): void {
    this.isEditable = false;
    this.patientData.get("nationality")?.disable();
    this.patientData.get("region")?.disable();
    this.patientData.get("commune")?.disable();
    this.patientData.get("casfam")?.disable();
    this.patientData.get("medicalFacility")?.disable();
    this.patientData.get("maritalState")?.disable();
    this.patientData.get("fonasa")?.disable();
    this.patientData.get("region2")?.disable();
    this.patientData.get("cesfam")?.disable();
  }
  private enableForm(): void {
    this.isEditable = true;
    this.patientData.get("nationality")?.enable();
    this.patientData.get("region")?.enable();
    this.patientData.get("commune")?.enable();
    this.patientData.get("casfam")?.enable();
    this.patientData.get("medicalFacility")?.enable();
    this.patientData.get("maritalState")?.enable();
    this.patientData.get("fonasa")?.enable();
    this.patientData.get("region2")?.enable();
    this.patientData.get("cesfam")?.enable();
  }
  private setPatientData(patient: Patient): void {
    this.patientData.setValue({
      name: patient.name,
      lastName: patient.lastName,
      lastName2: patient.lastName2,
      nationality: patient.nationality,
      rut: patient.rut,
      birthday: patient.birthday,
      maritalState: patient.maritalState,
      sex: patient.sex,
      region: patient.region,
      commune: patient.commune,
      address: patient.address,
      village: patient.village,
      residenceTime: patient.residenceTime,
      previousRegion: patient.previousRegion,
      cesfam: patient.cesfam,
      medicalFacility: patient.medicalFacility,
      cellphone: patient.cellphone,
      emergencyPhone: patient.emergencyPhone,
      mail: patient.mail,
      fonasa: patient.fonasa,
      volunteerAgreement: patient.volunteerAgreement,
      inAgeRange: true,
      dataAgreement: true,
    })
  }

  private checkPatientInCancer(data: CancerCheck): boolean {
    const keyRef = this.cancerKey.toLowerCase()
    return Object.entries(data).some(e => e[0] === keyRef && e[1] != null)
  }
}

