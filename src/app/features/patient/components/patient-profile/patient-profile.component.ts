import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Observable, Subscription } from 'rxjs';
import { Patient } from 'src/app/features/patient/models/patient';
import { Features, Permission } from 'src/app/features/users-management/models/privilege';
import { Region } from 'src/app/core/models/region';
import { AdministrativeService } from 'src/app/core/services/administrative/administrative.service';
import { PatientService } from 'src/app/features/patient/services/patient.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { mergeMap } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { trigger, transition, style, animate } from '@angular/animations';
import { AppError } from 'src/app/core/models/app-error';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css'],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(-100%)" }), //apply default styles before animation starts
        animate(
          "750ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "600ms ease-in-out",
          style({ opacity: 0, transform: "translateX(-100%)" })
        )
      ])
    ])
  ]
})
export class PatientProfileComponent implements OnInit, OnChanges, OnDestroy {
  private subs$ = new Subscription();
  PERMISSIONS = Permission
  FEATURES = Features

  @ViewChild("accordionA") accordionA!: MatAccordion;

  // accordion controls
  isOpenA: boolean = false;
  isOpenB: boolean = false;
  communesLoading: boolean = false;
  showEditionToolbar: boolean = false;

  // others
  isReady = false;

  // data mnagement
  @Input() patientId!: number;

  @Input() isEditable: boolean = false;
  @Output() isEditableChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  regions: Region[] = []
  communes: Region[] = []
  cesfamList: string[] = [];
  nationalities!: string[];
  mStateList: string[] = [];
  fonasaList: string[] = [];

  patientName: string = 'Desconocido';
  patientForm: FormGroup;
  undo!: Patient;

  private PHONE_PATTERN = AppConstants.phoneNumberPattern
  private EMAIL_PATTERN = AppConstants.emailPattern
  constructor(private patientService: PatientService, private adminService: AdministrativeService, private confirm: MatDialog) {
    this.patientForm = new FormGroup({
      idPatient: new FormControl(),
      name: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      lastName2: new FormControl(),
      nationality: new FormControl(null, Validators.required),
      rut: new FormControl(null, Validators.required),
      birthday: new FormControl(null, Validators.required),
      maritalState: new FormControl(),
      sex: new FormControl(null, Validators.required),
      region: new FormControl(null, Validators.required),
      commune: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      village: new FormControl(),
      residenceTime: new FormControl(null, Validators.required),
      previousRegion: new FormControl(),
      cesfam: new FormControl(),
      medicalFacility: new FormControl(),
      cellphone: new FormControl(null, [Validators.required, Validators.pattern(this.PHONE_PATTERN)]),
      emergencyPhone: new FormControl(null, Validators.pattern(this.PHONE_PATTERN)),
      mail: new FormControl(null, Validators.pattern(this.EMAIL_PATTERN)),
      fonasa: new FormControl(null, Validators.required),
      volunteerAgreement: new FormControl(null, Validators.requiredTrue),
      deceased: new FormControl(),
      deceasedByCancer: new FormControl(),
      deceaseDate: new FormControl()
    })
  }
  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }
  ngOnInit(): void {
    this.subs$.add(this.adminService.getPatientSelectData().subscribe(res => {
      this.nationalities = res.nationalities;
      this.cesfamList = res.cesfams;
      this.mStateList = res.maritalStates;
      this.regions = res.regions;
      this.fonasaList = res.fonasa
    }
    ))
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.patientId) {
      this.subs$.add(this.patientService.getPatient(this.patientId).pipe(mergeMap(res => {
        this.undo = res.data[0]
        this.patientName = this.undo.name + " " + this.undo.lastName + " " + (this.undo.lastName2 ?? "");
        this.setPatientData(this.undo);
        const regref = this.undo.region;
        if (!!regref)
          return this.adminService.getCommuneByRegion(regref);
        else
          return new Observable<false>();
      })).subscribe(res => {
        if (res) {
          this.communes = res.data
        }
      }))
    }
  }

  public getCommunes(): void {
    this.communesLoading = true;
    this.communes = [];
    this.subs$.add(this.adminService.getCommuneByRegion(this.patientForm.get('region')?.value).subscribe(res => {
      this.communes = res.data;
      this.communesLoading = false;
    }))
  }

  enableEdit(value: boolean): void {
    this.isEditable = value;
    this.undo = this.patientForm.value;
    this.isEditableChange.emit(this.isEditable);
  }

  public updateData(): void {
    const prevReg = this.patientForm.get('previousRegion')
    const desDate = this.patientForm.get('deceaseDate')
    const desByC = this.patientForm.get('deceasedByCancer')
    if (!this.patientForm.get('residenceTime')?.value)
      prevReg?.setValidators(Validators.required);
    else {
      prevReg?.removeValidators(Validators.required);
      prevReg?.reset();
    }
    if (this.patientForm.get('deceased')?.value) {
      desDate?.addValidators(Validators.required);
      desByC?.addValidators(Validators.required);
    } else {
      desDate?.removeValidators(Validators.required);
      desByC?.removeValidators(Validators.required);
      desByC?.reset();
      desDate?.reset();
    }
    desByC?.updateValueAndValidity();
    desDate?.updateValueAndValidity();
    prevReg?.updateValueAndValidity();
    if (this.patientForm.valid) {
      this.subs$.add(this.patientService.updatePatient(this.patientForm.value).subscribe(() => {
        this.isEditable, this.showEditionToolbar = false;
        this.patientForm.markAsPristine()
        this.isEditableChange.emit(false);
      }))
    } else {
      this.patientForm.markAllAsTouched()
      throw new AppError(AppConstants.FORM_ERROR)
    }

  }

  // accordions controls
  openAll(): void {
    this.isOpenA = true;
    this.accordionA.openAll();
  }

  closeAll(): void {
    this.isOpenA = false;
    this.accordionA.closeAll();
  }

  closeProfile(): Observable<any> | undefined {
    if (this.isEditable) {
      const config = new MatDialogConfig()
      config.maxWidth = "300px"
      config.data = {
        title: "Cambios Sin Guardar",
        msg: "Existen cambios sin guardar ¿Desea salir de todas formas?",
        action: "Salir sin guardar",
        action2: 'Volver'
      }
      return this.confirm.open(ConfirmDialogComponent, config).afterClosed();
    } else
      return undefined;
  }

  private setPatientData(patient: Patient): void {
    this.patientForm.setValue({
      idPatient: this.patientId,
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
      deceased: patient.deceased,
      deceasedByCancer: patient.deceasedByCancer,
      deceaseDate: patient.deceaseDate,
    })
  }
}


