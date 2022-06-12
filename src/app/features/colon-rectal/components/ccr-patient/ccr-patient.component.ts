import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { CCRRiskSurveyFamilyCancer } from 'src/app/features/colon-rectal/models/ccr-risk-survey';
import { Coloncheck } from 'src/app/features/colon-rectal/models/coloncheck';
import { Colonoscopy } from 'src/app/features/colon-rectal/models/colonoscopy';
import { Features, Permission } from 'src/app/features/users-management/models/privilege';
import { CCRPatientService } from 'src/app/features/colon-rectal/services/ccr-patient/ccr-patient.service';
import { PatientService } from 'src/app/features/patient/services/patient.service';
import { DateTimeService } from 'src/app/core/services/date-time/date-time.service';
import { MatPaginator } from '@angular/material/paginator';
import { AppError } from 'src/app/core/models/app-error';
import { ScreeningSurveyQuestion } from 'src/app/core/models/ScreeningSurveyQuestion';
import { AdministrativeService } from 'src/app/core/services/administrative/administrative.service';
import { mergeMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { forkJoin, from, Observable, Subscription } from 'rxjs';
import { CCRBiopsy } from '../../models/ccr-biopsy';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-ccr-patient',
  templateUrl: './ccr-patient.component.html',
  styleUrls: ['./ccr-patient.component.css'],
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
export class CCRPatientComponent implements OnChanges, OnDestroy {
  private subs$ = new Subscription();
  NO_TABLE_DATA = AppConstants.NO_TABLE_DATA
  FORM_ERROR: string = AppConstants.FORM_ERROR;
  FEATURES = Features
  PERMISSIONS = Permission

  @Input() patientId!: number;
  isEditable: boolean = false;
  @Output() isEditableChange: EventEmitter<boolean> = new EventEmitter()

  @ViewChild("accordionB") accordionB!: MatAccordion;
  @ViewChild('familyTable', { static: true }) familyTable!: MatTable<CCRRiskSurveyFamilyCancer>
  @ViewChild('checkPaginator') checkPaginator!: MatPaginator;
  @ViewChild('colonoscopyPaginator') colonoscopyPaginator!: MatPaginator;
  @ViewChild('biopsyPaginator') biopsyPaginator!: MatPaginator;
  @ViewChild('familyPaginator') familyPaginator!: MatPaginator;

  cancer: string = AppConstants.CCR_NAME

  isOpen: boolean = false;
  hasFindings: boolean = false;

  patientForm!: FormGroup;

  familyMemberList!: MatTableDataSource<CCRRiskSurveyFamilyCancer>;
  familyMemberForm!: FormGroup;
  coloncheckList!: MatTableDataSource<Coloncheck>;
  coloncheckForm!: FormGroup;
  colonoscopyList!: MatTableDataSource<Colonoscopy>;
  colonoscopyForm!: FormGroup;
  survey: ScreeningSurveyQuestion[] = [];
  surveyForm!: FormGroup;
  biopsyList!: MatTableDataSource<CCRBiopsy>;
  biopsyForm!: FormGroup;
  pageSizeOptions = AppConstants.pageSizeOptions

  // risk survey
  basic!: FormGroup;
  pathologies!: FormGroup;
  habits!: FormGroup;
  cancerFamily!: FormGroup;
  pageForm!: FormGroup;

  familyOptions: string[] = FAMILY_MEMBER;
  undo: any;


  coloncheckResults: ExamResult[] = [
    { value: false, viewValue: "Negativo" },
    { value: true, viewValue: "Positivo" }
  ]
  colonoscopyResults: ExamResult[] = [
    { value: false, viewValue: "Sin Hallazgos" },
    { value: true, viewValue: "Con Hallazgos" }
  ]

  coloncheckFields: string[] = ["id", "testDate", "testResult", "delete"];
  colonoscopyFields: string[] = ["id", "testDate", "testResult", "polyps", "neoplasticLesion", "delete"];
  biopsyFields: string[] = ["idBiopsy", "biopsyDate", "delete", "result"];
  familyMemberCancerFields: string[] = ["member", "cancer", "age", 'delete'];

  riskFlag: boolean = false;
  constructor(private ccrService: CCRPatientService, private dtService: DateTimeService, private admin: AdministrativeService, private confirm: MatDialog, private patientService: PatientService) {
    this.surveyForm = new FormGroup({});
    this.patientForm = new FormGroup({
      idPatient: new FormControl(null, Validators.required),
      idCcr: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      cancerDetectionDate: new FormControl(),
      motivorechazo: new FormControl()
    });

  }
  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.patientId) {
      this.subs$.add(this.admin.getCCRSurvey().pipe(mergeMap(res => {
        res.data.forEach(d => this.surveyForm.addControl(d.name, new FormControl()));
        this.surveyForm.addControl('idPatient', new FormControl(this.patientId, Validators.required));
        this.surveyForm.addControl('idEnrollmentSurvey', new FormControl(null, Validators.required));
        this.survey = res.data;
        return this.ccrService.getPatientEnrollmentSurvey(this.patientId);
      })).subscribe(res => this.surveyForm.setValue(res.data[0])));

      this.subs$.add(this.ccrService.getPatientById(this.patientId).subscribe(res => {
        this.patientForm.setValue(res.data[0])
      }))
      this.subs$.add(this.ccrService.getColoncheckList(this.patientId).subscribe(res => {
        this.coloncheckList = new MatTableDataSource<Coloncheck>(res.data);
      }, () => this.coloncheckList = new MatTableDataSource(), () => this.coloncheckList.paginator = this.checkPaginator))

      this.subs$.add(this.ccrService.getColonoscopyList(this.patientId).subscribe(res => {
        this.colonoscopyList = new MatTableDataSource<Colonoscopy>(res.data);
      }, () => this.colonoscopyList = new MatTableDataSource<Colonoscopy>(), () => this.colonoscopyList.paginator = this.colonoscopyPaginator))

      this.subs$.add(this.ccrService.getBiopsyList(this.patientId).subscribe(
        res => {
          this.biopsyList = new MatTableDataSource(res.data);
        },
        () => this.biopsyList = new MatTableDataSource(),
        () => this.biopsyList.paginator = this.biopsyPaginator
      ))

      this.familyMemberList = new MatTableDataSource<CCRRiskSurveyFamilyCancer>();
      this.familyMemberForm = new FormGroup({
        idPatient: new FormControl(this.patientId, Validators.required),
        idRiskSurveyFamilyCancer: new FormControl(),
        familyMember: new FormControl(null, Validators.required),
        cancer: new FormControl(null, Validators.required),
        age: new FormControl(null, Validators.required)
      })

      this.coloncheckForm = new FormGroup({
        idColoncheck: new FormControl(),
        idPatient: new FormControl(this.patientId, Validators.required),
        testResult: new FormControl(null, Validators.required),
        testDate: new FormControl(null, Validators.required)
      })

      this.colonoscopyForm = new FormGroup({
        idColonoscopy: new FormControl(),
        idPatient: new FormControl(this.patientId, Validators.required),
        testDate: new FormControl(null, Validators.required),
        testResult: new FormControl(null, Validators.required),
        polyps: new FormControl(),
        neoplasticLesion: new FormControl()
      }, this.validateFindings())

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

  /**
   * Adds a new coloncheck to the server.
   * 
   * If valid, calls the CCR service to make a POST request with the new
   * coloncheck data. If success, insert the new exam in the coloncheck 
   * table.
   */
  addColoncheck() {
    if (this.coloncheckForm.valid) {
      this.subs$.add(this.ccrService.addColonCheck(this.coloncheckForm.value).subscribe(res => {
        const dataRef = this.coloncheckList.data;
        this.coloncheckForm.get('idColoncheck')?.setValue(res.data[0].idColoncheck)
        dataRef.push(this.coloncheckForm.value)
        this.coloncheckList.data = dataRef;
        this.coloncheckForm.reset();
        this.coloncheckForm.get('idPatient')?.setValue(this.patientId);
        this.coloncheckList.paginator?.lastPage()
      }))
    } else {
      this.coloncheckForm.markAllAsTouched();
      throw new AppError(this.FORM_ERROR);
    }
  }

  /**
   * Deletes the selected coloncheck.
   * 
   * Triggers a confirmation dialog for the deletion, if
   * user confirm, calls the CCR service to make a delete 
   * request and removes the entry from the table, otherwise
   * close the dialog without changes.
   * 
   * @param exam  The Coloncheck object to be deleted.
   */
  deleteColoncheck(exam: Coloncheck): void {
    const config = new MatDialogConfig()
    config.data = {
      title: "Eliminar Coloncheck",
      action: "Eliminar",
      msg: "¿Seguro/a  que desea eliminar coloncheck nº" + exam.idColoncheck + "?",
    }
    const diaRef = this.confirm.open(ConfirmDialogComponent, config);
    this.subs$.add(diaRef.afterClosed().pipe(mergeMap(res => {
      if (res.response)
        return this.ccrService.deleteColoncheck(exam.idColoncheck);
      else
        return new Observable<false>();
    })).subscribe(res => {
      if (res) {
        this.coloncheckList.data = this.coloncheckList.data.filter(d => d.idColoncheck !== exam.idColoncheck)
        if (this.coloncheckList.paginator)
          this.coloncheckList.paginator.firstPage()
      }
    }))
  }

  /**
   * Adds a new colonoscopy
   * 
   * If valid, calls the CCR service to make a POST request with
   * the new colonoscopy data, if success, insert the new data to
   * the colonoscopy table.
   * 
   */
  addColonoscopy() {
    if (this.colonoscopyForm.valid) {
      this.subs$.add(this.ccrService.addColonoscopy(this.colonoscopyForm.value).subscribe(res => {
        this.colonoscopyForm.get('idColonoscopy')?.setValue(res.data[0].idColonoscopy)
        const dataRef = this.colonoscopyList.data;
        dataRef.push(this.colonoscopyForm.value)
        this.colonoscopyList.data = dataRef;
        this.colonoscopyForm.reset();
        this.colonoscopyForm.get('idPatient')?.setValue(this.patientId);
        this.hasFindings = false;
        this.colonoscopyList.paginator?.lastPage()
      }))
    } else {
      this.colonoscopyForm.markAllAsTouched()
      throw new AppError(this.FORM_ERROR)
    }
  }

  /**
   * Deletes the selected colonoscopy.
   * 
   * Triggers a confirmation dialog, if user confirm, calls 
   * the CCR service to make a delete request to the server,
   * on success removes the entry from the table. If user 
   * cancel, closes the dialog without changes.
   * 
   * @param exam 
   */
  deleteColonoscopy(exam: Colonoscopy): void {
    const config = new MatDialogConfig()
    config.data = {
      title: "Eliminar Colonoscopía",
      action: "Eliminar",
      msg: "¿Seguro/a  que desea eliminar colonoscopía nº" + exam.idColonoscopy + "?",
    }
    const diaRef = this.confirm.open(ConfirmDialogComponent, config);
    this.subs$.add(diaRef.afterClosed().pipe(mergeMap(res => {
      if (res.response)
        return this.ccrService.deleteColonoscopy(exam.idColonoscopy);
      else
        return new Observable<false>();
    })).subscribe(res => {
      if (res) {
        this.colonoscopyList.data = this.colonoscopyList.data.filter(d => d.idColonoscopy !== exam.idColonoscopy)
        if (this.colonoscopyList.paginator)
          this.colonoscopyList.paginator.firstPage()
      }
    }))
  }

  /**
   * Adds a new biopsy.
   * 
   * If valid, calls the CCR service to make a POST
   * request to the server with new biopsy data. On
   * success insert the new data to the biopsy table.
   */
  addBiopsy(): void {
    console.log(this.biopsyForm.value)
    if (this.biopsyForm.valid)
      this.subs$.add(this.ccrService.addBiopsy(this.biopsyForm.value).subscribe(res => {
        this.biopsyForm.get('idBiopsy')?.setValue(res.data[0].idBiopsy);
        const dataRef = this.biopsyList.data
        dataRef.push(this.biopsyForm.value);
        this.biopsyList.data = dataRef;
        this.biopsyForm.reset();
        this.biopsyForm.get('idPatient')?.setValue(this.patientId);
        this.biopsyList.paginator?.lastPage();
      }))
    else {
      this.biopsyForm.markAllAsTouched()
      throw new AppError(this.FORM_ERROR);
    }
  }

  /**
   * Deletes the selected biopsy.
   * 
   * Opens a confirmation dialog, if user confirms the
   * deletion, calls the CCR service to make a DELETE
   * request to the server, on success, removes the entry
   * from the boiopsy table. If user cancels the deletion,
   * closes the dialog without change.
   * 
   * @param exam 
   */
  deleteBiopsy(exam: CCRBiopsy): void {
    const config = new MatDialogConfig();
    config.data = {
      title: 'Eliminar Biopsia',
      action: 'Eliminar',
      msg: '¿Seguro que desea eliminar biopsia nº' + exam.idBiopsy + '?'
    }
    const diaRef = this.confirm.open(ConfirmDialogComponent, config)
    this.subs$.add(diaRef.afterClosed().pipe(mergeMap(res => {
      if (res.response)
        return this.ccrService.deleteBiopsy(exam.idBiopsy)
      else
        return new Observable<false>();
    })).subscribe(() => {
      this.biopsyList.data = this.biopsyList.data.filter(d => d.idBiopsy !== exam.idBiopsy);
      this.biopsyList.paginator?.firstPage();
    }))
  }

  /**
   * Updates the current patient information.
   * 
   * If valid, calls the CCR service to make a PUT request
   * to the server with the new data to be changed.
   * 
   */
  updatePatient(): void {
    if (this.patientForm.valid)
      this.subs$.add(this.ccrService.updatePatient(this.patientForm.value).subscribe(() => this.patientForm.markAsPristine()))
    else {
      this.patientForm.markAllAsTouched()
      throw new AppError(this.FORM_ERROR);
    }
  }

  /**
   * Updates the enrollment survey for the current cancer program
   * 
   * If valid, calls the CCR service to make a PUT request to the server
   * with the new data to be changed.
   */
  updateEnrollmentSurvey(): void {
    if (this.surveyForm.valid)
      this.subs$.add(this.ccrService.updateEnrollmentSurvey(this.surveyForm.value).subscribe(() => this.surveyForm.markAsPristine()))
  }

  /**
   * State function for handlig the display of conditional DOM content
   * 
   * @param value   The value used to determine the action performed
   */
  showFindings(value: boolean): void {
    this.hasFindings = value;
    if (!value) {
      this.colonoscopyForm.get("polyps")?.reset()
      this.colonoscopyForm.get("neoplasticLesion")?.reset()
    }
  }

  /**
   * Adds a new family member with cancer history.
   * 
   *If valid,  calls the CCR service to make a POST request to the server
   *with the new data to be stored, on success, create a new entry in the
   *respective table with the new information.
   *
   */
  addFamilyMemberCancer(): void {
    if (this.familyMemberForm.valid) {
      this.subs$.add(this.ccrService.addFamilyCancerRiskSurvey(this.familyMemberForm.value).subscribe(res => {
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

  /**
   * Removes a family member with cancer history.
   * 
   * Opens a confirmation dialog, if user confirms the deletion,
   * calls the CCR server to make a DELETE request to the server,
   * on success removes the entry from the table. If user cancels,
   * closes the dialog without changes.
   * 
   * @param data 
   */
  removeMember(data: CCRRiskSurveyFamilyCancer): void {
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
        return this.ccrService.deleteFamily(data.idRiskSurveyFamilyCancer)
      else
        return new Observable<false>();
    })).subscribe(res => {
      if (res) {
        this.familyMemberList.data = this.familyMemberList.data.filter(d => d.idRiskSurveyFamilyCancer !== data.idRiskSurveyFamilyCancer)
        this.familyMemberList.paginator?.firstPage();
      }
    }))
  }

  /**
   * Loads all sections of the risk survey.
   */
  loadAllRiskSurvey(): void {
    if (!this.riskFlag)
      this.subs$.add(this.ccrService.getCompleteRiskSurvey(this.patientId).subscribe(res => {
        this.basic.setValue(res.general);
        this.habits.setValue(res.habits);
        this.pathologies.setValue(res.pathologies);
        this.familyMemberList = new MatTableDataSource(res.family);
        this.familyMemberList.paginator = this.familyPaginator;
        this.undo = this.pageForm.getRawValue();
        this.riskFlag = true;
      }))
  }

  /**
   * Updates the risk survey information.
   * 
   * If valid, check the state of every section of the survey and make
   * a forkJoin request with the every changed sections.
   */
  updateSurveyRisk(): void {
    if (this.pageForm.valid) {
      const update: Observable<any>[] = []
      if (this.basic.dirty)
        update.push(this.ccrService.updateGeneralRiskSurvey(this.basic.value))
      if (this.pathologies.dirty)
        update.push(this.ccrService.updatePathologiesRiskSurvey(this.pathologies.value))
      if (this.habits.dirty)
        update.push(this.ccrService.updateHabitsRiskSurvey(this.habits.value))
      this.subs$.add(forkJoin(update).subscribe(res => {
        this.undo = this.pageForm.value;
        this.pageForm.markAsPristine();
      }))
    } else {
      this.pageForm.markAllAsTouched();
      throw new AppError(this.FORM_ERROR);
    }
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
        return this.patientService.deleteAllPatientByid(this.patientId)
      else
        return new Observable<false>();
    })).subscribe(() => {
    }))
  }

  /**
   * Resets the last changes to the risk survey.
   */
  cancelSurveyRiskChanges(): void {
    this.pageForm.setValue(this.undo)
    this.pageForm.markAsPristine();
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

  checkColoncheckResult(value: boolean): string | undefined {
    return this.coloncheckResults.find(e => e.value == value)?.viewValue;
  }

  checkColonoscopyResult(value: boolean): string | undefined {
    return this.colonoscopyResults.find(e => e.value == value)?.viewValue;
  }

  formatDate(date: string): string {
    const parseDate = new Date(date).toISOString();
    return this.dtService.formatDateOnly(this.dtService.parse(parseDate));
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

  updateRejectionConditionals(checked: boolean): void {
    if (checked)
      this.basic.get('signConsent')?.disable()
    else {
      this.basic.get('signConsent')?.enable()
      this.basic.get('colonoscopyRejectionSignature')?.reset()
    }
  }

  validateFindings(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const tesRef: AbstractControl | null = control.get('testResult');
      return !tesRef?.value ? null : ((control.get('polyps')?.value || control.get('neoplasticLesion')?.value) ? null : { findingRequired: true })
    }
  }
}

interface ExamResult {
  value: boolean;
  viewValue: string;
}

interface FamilyMember {
  value: string;
  viewValue: string;
}

const FAMILY_MEMBER: string[] = ["Hijo/a", "Mamá", "Papá", "Hermano/a", "Abuelo/a", "Tío/a"]