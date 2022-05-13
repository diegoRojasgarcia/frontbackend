import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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

@Component({
  selector: 'app-cbp-patient',
  templateUrl: './cbp-patient.component.html',
  styleUrls: ['./cbp-patient.component.css']
})
export class CBPPatientComponent implements OnChanges, OnDestroy {
  private subs$ = new Subscription();

  @ViewChild('tacPaginator') tacPaginator!: MatPaginator;
  @ViewChild('bioPaginator') bioPaginator!: MatPaginator;

  private FORM_ERROR = AppConstants.FORM_ERROR;
  NO_TABLE_DATA: string = AppConstants.NO_TABLE_DATA
  LUNG_RADS = RADS;

  PERMISSIONS = Permission;
  FEATURES = Features;

  @Input() patientId!: number;

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

  isTouched: boolean = false;
  examsFlag: boolean = false;

  constructor(private admin: AdministrativeService, private cbpService: CBPPatientService, private confirm: MatDialog, private dtService: DateTimeService) {
    this.surveyForm = new FormGroup({})
    this.patientForm = new FormGroup({
      idCbp: new FormControl(null, Validators.required),
      idPatient: new FormControl(null, Validators.required),
      derivationStateNfm: new FormControl(),
      state: new FormControl(null, Validators.required),
      cancerDetectionDate: new FormControl()
    })
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.patientId) {
      this.subs$.add(this.admin.getCBPSurvey().pipe(mergeMap(res => {
        res.data.forEach(q => this.surveyForm.addControl(q.name, new FormControl()))
        this.surveyForm.addControl('idEnrollmentSurvey', new FormControl())
        this.surveyForm.addControl('idPatient', new FormControl())
        this.survey = res.data
        return this.cbpService.getEnrollmentSurvey(this.patientId)
      })).subscribe(res => this.surveyForm.setValue(res.data[0]), err => this.surveyForm = new FormGroup({})))
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
    }
  }
  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }

  /**
   * If valid, updates the patient state in the current cancer program.
   */
  public updatePatientState(): void {
    if (this.patientForm.valid)
      this.subs$.add(this.cbpService.updatePatient(this.patientForm.value).subscribe(() => this.patientForm.markAsPristine()))
    else {
      this.patientForm.markAllAsTouched();
      throw new AppError(this.FORM_ERROR);
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

}
