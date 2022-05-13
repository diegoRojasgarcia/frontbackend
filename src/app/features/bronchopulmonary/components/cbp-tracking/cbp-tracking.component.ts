import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { TACTrackingPatient } from 'src/app/features/bronchopulmonary/models/cbp-tracking';
import { Patient } from 'src/app/features/patient/models/patient';
import { DateTimeService } from 'src/app/core/services/date-time/date-time.service';
import { Observable, Subscription } from 'rxjs';
import { CBPPatientService } from '../../services/cbp-patient/cbp-patient.service';

@Component({
  selector: 'app-cbp-tracking',
  templateUrl: './cbp-tracking.component.html',
  styleUrls: ['./cbp-tracking.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CBPTrackingComponent implements OnInit, OnDestroy {

  private subs$: Subscription = new Subscription();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() openProfile: EventEmitter<number> = new EventEmitter<number>();

  pageSizeOptions: number[] = AppConstants.pageSizeOptions;
  @Input() filter: string = '';

  private NO_DATA: string = AppConstants.NO_DATA;
  NO_TABLE_DATA: string = AppConstants.NO_TABLE_DATA

  columns: Column[] = [
    { columnValue: 'contact', name: 'Contacto', cell: (row: TACTrackingPatient): boolean => row.contact },
    { columnValue: 'nextDate', name: 'Siguiente Tac', cell: (row: TACTrackingPatient) => this.formatViewDate(row.nextDate) },
    { columnValue: 'name', name: 'Nombre', cell: (row: TACTrackingPatient) => row.name + " " + row.lastName + " " + (row.lastName2 ?? '') },
    { columnValue: 'cellphone', name: 'Teléfono', cell: (row: TACTrackingPatient) => row.cellphone ?? this.NO_DATA },
    { columnValue: 'expand', name: '', cell: (row: TACTrackingPatient) => undefined },
  ]

  displayedColumns: string[] = this.columns.map(e => e.columnValue);

  expandedElement!: Patient | null;

  patientsTracking!: MatTableDataSource<TACTrackingPatient>;;

  constructor(private dtService: DateTimeService, private cbpSvc: CBPPatientService) { }

  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }

  ngOnInit(): void {
    this.subs$.add(this.cbpSvc.getTACTrackingList().subscribe(res => {
      this.patientsTracking = new MatTableDataSource(res.data);
      this.patientsTracking.sort = this.sort;
      this.patientsTracking.paginator = this.paginator;
    }, err =>{
      const data: TACTrackingPatient[]= []
      this.NO_TABLE_DATA = AppConstants.NO_TABLE_DATA_ERROR;
      this.patientsTracking = new MatTableDataSource(data);
    }))
  }

  /**
   * Update the selected contact state
   * 
   * @param value   The new value of the state.
   * @param row     The row data to be changed.
   */
  updateTrackingContact(value: boolean, row: TACTrackingPatient): void {
    this.expandedElement = null;
    this.subs$.add(this.cbpSvc.updateTrackingContact(row.idPatient, value).pipe(catchError((err, c) => {
      row.contact = !row.contact;
      return new Observable<never>();
    })).subscribe())
  }

  /**
   * Search in the table by the given <code>string</code>.
   */
  filterData(): void {
    this.patientsTracking.filter = this.filter.trim().toLowerCase();
  }

  /**
   * Handles the profile opening of a selected patient
   * 
   * Emits the patient id to a parent component that will handle
   * the respective operation.
   * 
   * @param patientId   The id of the selected patient to be opened
   */
  handleProfile(patientId: number): void {
    this.openProfile.emit(patientId);
  }

  checkDataDisplay(value: any): string {
    return typeof value;
  }

  formatViewDate(date: Date | string | undefined | null): string | Date {
    return this.dtService.formatViewDate(date);
  }

}

interface Column {
  columnValue: string;
  name: string;
  cell: Function;
}

