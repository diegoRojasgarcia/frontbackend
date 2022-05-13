import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { CBPPatient } from 'src/app/features/bronchopulmonary/models/cbp-patient';
import { CBPPatientService } from 'src/app/features/bronchopulmonary/services/cbp-patient/cbp-patient.service';

@Component({
  selector: 'app-cbp-patient-list',
  templateUrl: './cbp-patient-list.component.html',
  styleUrls: ['./cbp-patient-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
/** */
export class CBPPatientListComponent implements AfterViewInit, OnDestroy {
  private subs$ = new Subscription();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSizeOptions: number[] = AppConstants.pageSizeOptions;
  expandedElement: CBPPatient | null = null;

  private NO_VALUE: string = "No Informado"
  NO_TABLE_DATA: string = AppConstants.NO_TABLE_DATA;

  columnsJoin: ColumnInterface[] = [
    { columnValue: 'name', columnName: 'Nombre Completo', cell: (row: CBPPatient) => row.name + " " + row.lastName + " " + (row.lastName2 ? row.lastName2 : '') },
    { columnValue: 'age', columnName: 'Edad', cell: (row: CBPPatient) => row.age ? row.age : this.NO_VALUE },
    { columnValue: 'work', columnName: 'Profesión de Riesgo', cell: (row: CBPPatient) => row.riskProfession },
    { columnValue: 'tacCounter', columnName: "Contador TAC", cell: (row: CBPPatient) => row.tacCounter ? row.tacCounter : this.NO_VALUE },
    { columnValue: 'state', columnName: 'Derivación', cell: (row: CBPPatient) => row.derivationStateNfm ? row.derivationStateNfm : this.NO_VALUE },
    { columnValue: 'rads', columnName: 'LUNG RADS', cell: (row: CBPPatient) => row.lungRads ? row.lungRads : this.NO_VALUE },
    { columnValue: 'expand', columnName: '', cell: (row: CBPPatient) => undefined },
  ];

  columnsToDisplay: string[] = this.columnsJoin.map(e => e.columnValue)


  dataSource!: MatTableDataSource<CBPPatient>;

  @Input() filter!: string;
  @Input() filter1!: string;

  @Output() openProfile: EventEmitter<number> = new EventEmitter<number>();

  filterMsg: string = '';

  constructor(private cbpPatientService: CBPPatientService, private router: Router) { }
  ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.subs$.add(this.cbpPatientService.getAllCBPPAtients().subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, err => {
      const data: CBPPatient[] = [];
      this.NO_TABLE_DATA = AppConstants.NO_TABLE_DATA_ERROR;
      this.dataSource = new MatTableDataSource(data);
    }))
  }
  /**
   * Handles the patient profile opening.
   * 
   * Emits the patient id of the user selected.
   * 
   * @param {number} patientId 
   */
  handleProfile(patientId: number): void {
    this.openProfile.emit(patientId);
  }



  /**
   * Silly function for typeof.
   * 
   * @param data 
   * @returns {string}
   */
  checkDataDisplay(data: any): string {
    return typeof data;
  }

  filterData(): void {
    const predRef = this.dataSource.filterPredicate
    this.dataSource.filterPredicate = (data: CBPPatient, filter: string): boolean => {
      this.filterMsg = "Filtro: LUNG/RAD " + filter
      if (filter === 'NN')
        return !data.lungRads
      else
        return data.lungRads === filter;
    }
    this.dataSource.filter = this.filter1;
    this.dataSource.filterPredicate = predRef;
  }
  /**
   * Search in table function
   * 
   * Clears any filter that may be active and perform a search.
   * 
   * @param void
   * @return {void}
   */
  search(): void {
    this.filter1 = '';
    this.filterMsg = '';
    this.dataSource.filter = this.filter?.toLowerCase().trim();
    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage()
  }

}




interface ColumnInterface {
  columnValue: string;
  columnName: string;
  cell: Function;
}
