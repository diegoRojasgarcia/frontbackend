import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CBPRiskSurveyFamilyCancer } from 'src/app/features/bronchopulmonary/models/cbp-risk-survey';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { AppError } from 'src/app/core/models/app-error';
import { ScreeningSurveyQuestion } from 'src/app/core/models/ScreeningSurveyQuestion';
import { AdministrativeService } from 'src/app/core/services/administrative/administrative.service';
import { DateTimeService } from 'src/app/core/services/date-time/date-time.service';
import { CBPBiopsy, CBPBiopsyType, RADS, TAC } from 'src/app/features/bronchopulmonary/models/cbp-exams';
import { Features, Permission } from 'src/app/features/users-management/models/privilege';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { CBPPatientService } from '../../services/cbp-patient/cbp-patient.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { PatientService } from 'src/app/features/patient/services/patient.service';

@Component({
  selector: 'app-cbp-patient',
  templateUrl: './cbp-patient.component.html',
  styleUrls: ['./cbp-patient.component.css'],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
        animate(
          "750ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "600ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
    
  ]
})
export class CBPPatientComponent implements OnChanges, OnDestroy {
  private subs$ = new Subscription();

  @ViewChild('tacPaginator') tacPaginator!: MatPaginator;
  @ViewChild('bioPaginator') bioPaginator!: MatPaginator;

  @ViewChild("accordionB") accordionB!: MatAccordion;
  @ViewChild('familyPaginator') familyPaginator!: MatPaginator;
  @ViewChild('familyTable', { static: true }) familyTable!: MatTable<CBPRiskSurveyFamilyCancer>

  private FORM_ERROR = AppConstants.FORM_ERROR;
  NO_TABLE_DATA: string = AppConstants.NO_TABLE_DATA
  LUNG_RADS = RADS;

  PERMISSIONS = Permission;
  FEATURES = Features;

  @Input() patientId!: number;
  isEditable: boolean = false;

  @Output() isEditableChange: EventEmitter<boolean> = new EventEmitter()

  tacList!: MatTableDataSource<TAC>;
  tacColumns: string[] = ["idLdct", "nodule", "lungRads", "size", "actions", "delete"];

  bpsyList!: MatTableDataSource<CBPBiopsy>;
  bpsyColumns: string[] = ['idBiopsy', 'type', 'biopsyDate', "delete"];
  bioTypes: CBPBiopsyType[] = []

  pageSizeOptions = AppConstants.pageSizeOptions;

  patientForm: FormGroup;
  surveyForm: FormGroup;
  biopsyForm!: FormGroup;
  tacForm!: FormGroup;
  survey: ScreeningSurveyQuestion[] = [];


  familyMemberList!: MatTableDataSource<CBPRiskSurveyFamilyCancer>;
  familyMemberForm!: FormGroup;
  //risk survey
  basic!: FormGroup;
  pathologies!: FormGroup;
  habits!: FormGroup;
  cancerFamily!: FormGroup;
  pageForm!: FormGroup;

  familyOptions: string[] = FAMILY_MEMBER;
  undo: any;

  isTouched: boolean = false;
  examsFlag: boolean = false;


  isOpen: boolean = false;
  riskFlag: boolean = false;

  familyMemberCancerFields: string[] = ["member", "cancer", "age", 'delete'];

  constructor(private admin: AdministrativeService, private cbpService: CBPPatientService, private confirm: MatDialog, private dtService: DateTimeService, private patientService: PatientService) {
    this.surveyForm = new FormGroup({})
    this.patientForm = new FormGroup({
      idCbp: new FormControl(null, Validators.required),
      idPatient: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      derivationStateNfm: new FormControl(),
      cancerDetectionDate: new FormControl(),
      motivorechazo: new FormControl()
    })
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.patientId) {
      this.subs$.add(this.admin.getCBPSurvey().pipe(mergeMap(res => {
        res.data.forEach(q => this.surveyForm.addControl(q.name, new FormControl()))
        this.surveyForm.addControl('idPatient', new FormControl(this.patientId, Validators.required));
        this.surveyForm.addControl('idEnrollmentSurvey', new FormControl(null, Validators.required));
        this.survey = res.data
        return this.cbpService.getEnrollmentSurvey(this.patientId)
      })).subscribe(res => this.surveyForm.setValue(res.data[0])));

      this.subs$.add(this.cbpService.getCBPPatientById(this.patientId).subscribe(res => this.patientForm.setValue(res.data[0])))


      this.tacForm = new FormGroup({
        size: new FormControl(null, Validators.required),
        nodule: new FormControl(),
        idPatient: new FormControl(this.patientId, Validators.required),
        idLdct: new FormControl(),
        ldctDate: new FormControl(null, Validators.required),
        lungRads: new FormControl(null, Validators.required),
        proposedTime: new FormControl(),
        biopsy: new FormControl(),
        petTc: new FormControl(),
      }, [this.validateRadAction()])
      this.biopsyForm = new FormGroup({
        type: new FormControl(null, Validators.required),
        idPatient: new FormControl(this.patientId, Validators.required),
        idBiopsy: new FormControl(),
        biopsyDate: new FormControl(null, Validators.required)
      })

      this.familyMemberList = new MatTableDataSource<CBPRiskSurveyFamilyCancer>();
      this.familyMemberForm = new FormGroup({
        idPatient: new FormControl(this.patientId, Validators.required),
        idRiskSurveyFamilyCancer: new FormControl(),
        familyMember: new FormControl(null, Validators.required),
        cancer: new FormControl(null, Validators.required),
        age: new FormControl(null, Validators.required)
      })


      this.biopsyForm = new FormGroup({
        idBiopsy: new FormControl(),
        idPatient: new FormControl(this.patientId, Validators.required),
        biopsyDate: new FormControl(null, Validators.required),
        result: new FormControl(null, [Validators.required, Validators.minLength(20)])
      })

      this.basic = new FormGroup({
        idPatient: new FormControl(this.patientId, Validators.required),
        idRiskSurveyBd: new FormControl(),
        cAbdominal: new FormControl(),
        paSystolic: new FormControl(),
        paDiastolic: new FormControl(),
        weight: new FormControl(),
        height: new FormControl(),
        imc: new FormControl(),
        regularMedications: new FormControl(),
        reasonMedicines: new FormControl(),
        anticoagulants: new FormControl(),
        wichAnticoagulants: new FormControl(),
        colonoscopyRejection: new FormControl(),
        colonoscopyRejectionSignature: new FormControl(),
        signConsent: new FormControl(),
        instructiveTsdo: new FormControl(),
      })
      this.pathologies = new FormGroup({
        idPatient: new FormControl(this.patientId, Validators.required),
        idRiskSurveyPathologies: new FormControl(),
        diabetes: new FormControl(),
        epilepsy: new FormControl(),
        operated: new FormControl(),
        cancer: new FormControl(),
        arterialHypertension: new FormControl(),
        gastricUlcer: new FormControl(),
        hypoHyperThyroidism: new FormControl(),
        operationReason: new FormControl(),
        typeCancer: new FormControl(),
        cancerAge: new FormControl(),
      })
      this.habits = new FormGroup({
        idPatient: new FormControl(this.patientId, Validators.required),
        idRiskSurveyHabits: new FormControl(),
        smokes: new FormControl(),
        numberCigarettes: new FormControl(),
        yearsSmoking: new FormControl(),
        eatCerealFiber: new FormControl(),
        drinkAlcohol: new FormControl(),
        quantityAlcohol: new FormControl(),
        physicalActivity: new FormControl(),
        threeFruits: new FormControl(),
        friedFoods: new FormControl()
      })
      this.pageForm = new FormGroup({
        basic: this.basic,
        habits: this.habits,
        pathologies: this.pathologies
      })
    }
  }
  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }


  updatePatient(): void {
    if (this.patientForm.valid)
      this.subs$.add(this.cbpService.updatePatient(this.patientForm.value).subscribe(() => this.patientForm.markAsPristine()))
    else {
      this.patientForm.markAllAsTouched()
      throw new AppError(this.FORM_ERROR);
    }
  }


  resetSmokerConditional(value: boolean): void {
    if (!value) {
      this.habits.get('numberCigarettes')?.reset()
      this.habits.get('yearsSmoking')?.reset()
    }
  }

  
  resetCancerConditionals(value: boolean): void {
    if (!value) {
      this.pathologies.get('typeCancer')?.reset()
      this.pathologies.get('cancerAge')?.reset()
    }
  }

  /**
   * If valid, updates the patient enrollment survey for the current cancer program
   */
  public updateEnrollmentSurvey(): void {
    if (this.surveyForm.valid)
      this.subs$.add(this.cbpService.updateEnrollmentSurvey(this.surveyForm.value).subscribe(() => this.surveyForm.markAsPristine()))
  }

  /**
   * Loads the patient exams for the current cancer program.
   * 
   * Only loads once. In case of new data in the server, a refresh will be required.
   */
  public loadExams(): void {
    if (!this.examsFlag)
      this.subs$.add(forkJoin([this.cbpService.getPatientTACList(this.patientId), this.cbpService.getPatientBiopsyList(this.patientId), this.admin.getBiopsyTypes()]).subscribe(res => {
        this.bpsyList = new MatTableDataSource(res[1].data);
        this.tacList = new MatTableDataSource(res[0].data);
        this.bioTypes = res[2].data;
        this.bpsyList.paginator = this.bioPaginator;
        this.tacList.paginator = this.tacPaginator;
      }, () => {
        this.NO_TABLE_DATA = AppConstants.NO_TABLE_DATA_ERROR
        this.bpsyList = new MatTableDataSource();
        this.tacList = new MatTableDataSource();
      }, () => this.examsFlag = true))
  }

  /**
   * If valid, adds a new TAC to the patient exam list.
   * 
   * First check the selected LUNG RAD type, If <code>1</code>
   * or <code>0</code>, the nodule field is no longer required and
   * the corresponding validators are removed, otherwise this field
   * needs to be specified and validators are added. Afterwards, 
   * checks the validity of the form fields, if valid, calls the CBP
   * service to make a POST request to the server, if success, the
   * new exam is added to the TAC table.
   */
  addTac(): void {
    this.isTouched = true;
    const lung = this.tacForm.get('lungRads')?.value
    if (lung === '1' || lung === '0')
      this.tacForm.get('nodule')?.removeValidators(Validators.required)
    else {
      this.tacForm.get('nodule')?.addValidators(Validators.required)
    }
    this.tacForm.get('nodule')?.updateValueAndValidity()
    this.tacForm.updateValueAndValidity()

    if (this.tacForm.valid)
      this.subs$.add(this.cbpService.addTAC(this.tacForm.value).subscribe(res => {
        this.tacForm.get('idLdct')?.setValue(res.data[0].idLdct)
        const dataRef = this.tacList.data;
        dataRef.push(this.tacForm.value)
        this.tacList.data = dataRef
        this.tacForm.reset();
        this.tacForm.get('idPatient')?.setValue(this.patientId);
        this.isTouched = false
      }))
    else {
      this.tacForm.markAllAsTouched()
      throw new AppError(this.FORM_ERROR)
    }
  }

  /**
   * Delete the selected TAC
   * 
   * Creates a confirmation dialog. If the user confirms, the TAC gets
   * deleted and removed from the table, otherwise the dialog is closed
   * without any changes.
   * 
   * @param data  The TAC data to be deleted.
   */
  public deleteTac(data: TAC): void {
    const config = new MatDialogConfig()
    config.data = {
      title: 'Eliminar',
      msg: '¿Seguro/a desea elminar TAC nº' + data.idLdct + '?',
      action: 'Eliminar'
    }
    const diaRef = this.confirm.open(ConfirmDialogComponent, config);
    this.subs$.add(diaRef.afterClosed().pipe(mergeMap(res => {
      if (res.response)
        return this.cbpService.removeTAC(data.idLdct);
      else
        return new Observable<false>();
    })).subscribe(res => {
      if (res) {
        this.tacList.data = this.tacList.data.filter(d => d.idLdct !== data.idLdct)
        if (this.tacList.paginator) {
          this.tacList.paginator.firstPage()
        }
      }
    }))

  }

  /**
   * If valid, adds a new biopsy to the patient.
   * 
   * Check the validity of the fields, then calls the CBP service
   * to make a POST request to the server with the new data. If 
   * success, show the new entry in the biopsy table.
   */
  addBiopsy(): void {
    if (this.biopsyForm.valid)
      this.subs$.add(this.cbpService.addCBPBiopsy(this.biopsyForm.value).subscribe(res => {
        this.biopsyForm.get('idBiopsy')?.setValue(res.data[0].idBiopsy)
        const dataRef = this.bpsyList.data;
        dataRef.push(this.biopsyForm.value);
        this.bpsyList.data = dataRef;
        this.biopsyForm.reset();
        this.biopsyForm.get('idPatient')?.setValue(this.patientId);
      }))
    else {
      this.biopsyForm.markAllAsTouched();
      throw new AppError(this.FORM_ERROR);
    }
  }

  /**
   * Delete the selected biopsy
   * 
   * Opens a confirmation dialog to the user, if user confirms, calls CBP
   * service to delete the exam from the server and if succeed, removes it
   * from the table as well. If cancel, close the dialog without changes.
   * 
   * @param data 
   */
  public deleteBiopsy(data: CBPBiopsy): void {
    const config = new MatDialogConfig()
    config.data = {
      title: 'Eliminar',
      msg: '¿Seguro/a desea elminar biopsia nº' + data.idBiopsy + '?',
      action: 'Eliminar'
    }
    const diaRef = this.confirm.open(ConfirmDialogComponent, config);
    this.subs$.add(diaRef.afterClosed().pipe(mergeMap(res => {
      if (res.response)
        return this.cbpService.removeCBPBiopsy(data.idBiopsy);
      else
        return new Observable<false>()

    })).subscribe(res => {
      if (res) {
        this.bpsyList.data = this.bpsyList.data.filter(d => d.idBiopsy !== data.idBiopsy)
        if (this.bpsyList.paginator)
          this.bpsyList.paginator.firstPage()
      }
    }))
  }

  formatDate(date: string): Date | string {
    return this.dtService.formatViewDate(date);
  }

  validateRadAction(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const lr = control.get('lungRads');
      return !lr?.value?.includes('4') ? null : ((control.get('proposedTime')?.value || control.get('biopsy')?.value || control.get('petTc')?.value) ? null : { actionRequired: true })
    }
  }

   //utility functions
   openAll(): void {
    this.isOpen = true;
    this.loadAllRiskSurvey();
    this.accordionB.openAll();
  }

  closeAll(): void {
    this.isOpen = false;
    this.accordionB.closeAll();
  }

  


  loadAllRiskSurvey(): void {
    if (!this.riskFlag)
      this.subs$.add(this.cbpService.getCompleteRiskSurvey(this.patientId).subscribe(res => {
        this.basic.setValue(res.general);
        this.habits.setValue(res.habits);
        this.pathologies.setValue(res.pathologies);
        this.familyMemberList = new MatTableDataSource(res.family);
        this.familyMemberList.paginator = this.familyPaginator;
        this.undo = this.pageForm.getRawValue();
        this.riskFlag = true;
      }))
  }

  deletePatient(): void {
    const config = new MatDialogConfig()
    config.data = {
      title: "Eliminar Paciente",
      action: "Eliminar",
      msg: "¿Seguro/a que desea eliminar al paciente ?, Se eliminaran todos sus datos",
    }
    const diaRef = this.confirm.open(ConfirmDialogComponent, config);

    this.subs$.add(diaRef.afterClosed().pipe(mergeMap(res => {
      if (res.response)
        return this.patientService.deleteAllPatientByid(this.patientId);
      else
        return new Observable<false>();
    })).subscribe(res => {
      if (res) {
        
      }
    }))

  }


  updateSurveyRisk(): void {
    if (this.pageForm.valid) {
      const update: Observable<any>[] = []
      if (this.basic.dirty)
        update.push(this.cbpService.updateGeneralRiskSurvey(this.basic.value))
      if (this.pathologies.dirty)
        update.push(this.cbpService.updatePathologiesRiskSurvey(this.pathologies.value))
      if (this.habits.dirty)
        update.push(this.cbpService.updateHabitsRiskSurvey(this.habits.value))
      this.subs$.add(forkJoin(update).subscribe(res => {
        this.undo = this.pageForm.value;
        this.pageForm.markAsPristine();
      }))
    } else {
      this.pageForm.markAllAsTouched();
      throw new AppError(this.FORM_ERROR);
    }
  }

  cancelSurveyRiskChanges(): void {
    this.pageForm.setValue(this.undo)
    this.pageForm.markAsPristine();
  }


  addFamilyMemberCancer(): void {
    if (this.familyMemberForm.valid) {
      this.subs$.add(this.cbpService.addFamilyCancerRiskSurvey(this.familyMemberForm.value).subscribe(res => {
        this.familyMemberForm.get('idRiskSurveyFamilyCancer')?.setValue(res.data[0].idRiskSurveyFamilyCancer)
        const dataRef = this.familyMemberList.data;
        dataRef.push(this.familyMemberForm.value);
        this.familyMemberList.data = dataRef;
        this.familyTable.dataSource = this.familyMemberList;
        this.familyMemberForm.reset();
        this.familyMemberForm.get('idPatient')?.setValue(this.patientId)
        this.familyMemberList.paginator?.lastPage()
      }))

    } else {
      this.familyMemberForm.markAllAsTouched()
      throw new AppError(this.FORM_ERROR);
    }

  }

  removeMember(data: CBPRiskSurveyFamilyCancer): void {
    const config = new MatDialogConfig();
    config.maxWidth = "300px"
    data.cancer = data.cancer.toLowerCase().replace('cáncer', '')
    data.cancer = data.cancer.toLowerCase().replace('cancer', '')
    config.data = {
      title: 'Eliminar Familiar',
      action: 'Eliminar',
      msg: '¿Seguro que desea eliminar a ' + data.familyMember + ' con cáncer: ' + data.cancer + '?'
    }
    const diaRef = this.confirm.open(ConfirmDialogComponent, config)
    this.subs$.add(diaRef.afterClosed().pipe(mergeMap(res => {
      if (res.response)
        return this.cbpService.deleteFamily(data.idRiskSurveyFamilyCancer)
      else
        return new Observable<false>();
    })).subscribe(res => {
      if (res) {
        this.familyMemberList.data = this.familyMemberList.data.filter(d => d.idRiskSurveyFamilyCancer !== data.idRiskSurveyFamilyCancer)
        this.familyMemberList.paginator?.firstPage();
      }
    }))
  }


}

const FAMILY_MEMBER: string[] = ["Hijo/a", "Mamá", "Papá", "Hermano/a", "Abuelo/a", "Tío/a"]
