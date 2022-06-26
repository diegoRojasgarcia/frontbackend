import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { CCRPatient } from 'src/app/features/colon-rectal/models/ccr-patient';
import { CCRPatientreports } from 'src/app/features/colon-rectal/models/ccr-reports';
import { CCRPatientService } from 'src/app/features/colon-rectal/services/ccr-patient/ccr-patient.service';
import { DateTimeService } from 'src/app/core/services/date-time/date-time.service';
import { Subscription } from 'rxjs';
import { XlsxExporterService, } from 'mat-table-exporter';
import { Features, Permission } from 'src/app/features/users-management/models/privilege';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';

@Component({
  selector: 'app-ccr-patient-list',
  templateUrl: './ccr-patient-list.component.html',
  styleUrls: ['./ccr-patient-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CCRPatientListComponent implements AfterViewInit, OnDestroy {
  private sub$ = new Subscription()
  private NO_DATA = AppConstants.NO_DATA;
  dataSource!: MatTableDataSource<CCRPatient>;
  dataSourcereports!: MatTableDataSource<CCRPatientreports>;
  columnsJoin: ColumnInterface[] = [
    { columnName: 'Nombre', columnValue: 'name', cell: (element: CCRPatient): string => element.name + " " + element.lastName + " " + (element.lastName2 ?? "") },
    { columnName: 'RUT', columnValue: 'rut', cell: (element: CCRPatient): string => element.rut ?? this.NO_DATA },
    { columnName: 'COLON-CHECK', columnValue: 'coloncheckResult', cell: (element: CCRPatient): boolean => element.coloncheckResult },
    { columnName: 'COLONOSCOPÍA', columnValue: 'colonoscopyResult', cell: (element: CCRPatient): boolean => element.colonoscopyResult },
    { columnName: 'ESTADO', columnValue: 'state', cell: (element: CCRPatient): string => element.state ?? this.NO_DATA },
    { columnName: '', columnValue: 'expand', cell: (element: CCRPatient) => undefined },
  ];

  columnsToDisplay = this.columnsJoin.map(c => c.columnValue)

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  expandedElement!: CCRPatient | null;
  @Input() filter!: string;
  @Input() filter1!: string;
  filterMsg: string = '';

  PERMISSIONS = Permission;
  FEATURES = Features;

  @Output() openProfile: EventEmitter<number> = new EventEmitter<number>()

  pageSizeOptions: number[] = AppConstants.pageSizeOptions

  NO_TABLE_DATA = AppConstants.NO_TABLE_DATA

  constructor(private patientService: CCRPatientService, private dtService: DateTimeService, private exportService: XlsxExporterService) {

  }
  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }


  ngAfterViewInit(): void {
    this.sub$.add(this.patientService.getAllCCRPatients().subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, err => {
      this.dataSource = new MatTableDataSource();
      this.NO_TABLE_DATA = AppConstants.NO_TABLE_DATA_ERROR;
    }))

    this.sub$.add(this.patientService.getAllCCRPatientsForReports().subscribe(res => {
      this.dataSourcereports = new MatTableDataSource(res.data);
    }, err => {
      this.dataSourcereports = new MatTableDataSource();
      this.NO_TABLE_DATA = AppConstants.NO_TABLE_DATA_ERROR;
    }))
  }



  /**
   * Search by the given string.
   */
  search() {
    this.filter1 = '';
    this.filterMsg = '';
    this.dataSource.filter = this.filter?.toLowerCase().trim();
    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage()
  }

  /**
   * Filters the table rows by the selected filter.
   */
  filterData(): void {
    const filterRef = this.dataSource.filterPredicate
    this.dataSource.filterPredicate = (data: CCRPatient, filter: string) => {
      switch (filter) {
        case '1':
          this.filterMsg = 'Filtro: COLONCHECK-POSITIVO'
          return data.coloncheckResult === true
        case '2':
          this.filterMsg = 'Filtro: COLONCHECK-NEGATIVO'
          return data.coloncheckResult === false
        case '3':
          this.filterMsg = 'Filtro: COLONOSCOPÍA-CON_HALLAZGOS'
          return data.colonoscopyResult === true
        case '4':
          this.filterMsg = 'Filtro: COLONOSCOPÍA-SIN_HALLAZGOS'
          return data.colonoscopyResult === false
        case '5':
          this.filterMsg = 'Filtro: COLONOSCOPÍA-SIN_REALIZAR'
          return data.colonoscopyResult === null || data.colonoscopyResult === undefined
        default:
          return false
      }
    }
    this.dataSource.filter = this.filter1;
    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage()
    this.dataSource.filterPredicate = filterRef
  }


  //utility functions
  checkDataDisplay(data: any): string {
    return typeof data
  }

  handleProfile(patientId: number) {
    this.openProfile.emit(patientId);
  }

  parseViewDate(date: Date): string | Date {
    return this.dtService.formatViewDate(date);
  }

  exportExcel() {

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Pacientes Colorectal');

    //Add Row and formatting
    let titleRow = worksheet.addRow(['']);
    
    worksheet.columns = [
      { header: 'id', key: 'id_patient', width: 6},
      { header: 'Nombre', key: 'name', width: 20},
      { header: 'Apellido Paterno', key: 'lastname', width: 20, },
      { header: 'Apellido Materno', key: 'lastname2', width: 20 },
      { header: 'Rut', key: 'rut', width: 15 },
      { header: 'Edad', key: 'edad', width: 6 },
      { header: 'Fecha Nacimiento', key: 'birthday', width: 20 },
      { header: 'Sexo', key: 'sex', width: 5},
      { header: 'Telefono', key: 'cellphone', width: 10 },
      { header: 'Direccion', key: 'address', width: 20 },
      { header: 'Prevision', key: 'previcion', width: 10 },
      { header: 'Peso (kg)', key: 'peso', width: 10},
      { header: 'Altura (cm)', key: 'altura', width: 15},
      { header: 'IMC', key: 'imc', width: 5},
      { header: 'C. Abdominal', key: 'cmabdominal', width: 15},
      { header: 'Fumador', key: 'smokes', width: 15},
      { header: 'Cantidad Cigarros', key: 'ncigarettes', width: 15},
      { header: 'Años Fumando', key: 'ysmoking', width: 15},
      { header: 'Fecha Deteccion Cancer ', key: 'cancerdetectiondate', width: 25 },
      { header: 'Colon Check', key: 'testresultcoloncheck', width: 20 },
      { header: 'Ultimo colon-check', key: 'lastcoloncheck', width: 20},
      { header: 'Cantidad Test Colon-Check', key: 'cantcoloncheck', width:10},
      { header: 'Colon Oscopia', key: 'colonoscopy', width: 13},
      { header: 'Polipos', key: 'polyps', width: 13},
      { header: 'Lesion Neoplastica', key: 'neoplasticlesion', width: 13},
      { header: 'Ultima Colonosocopia', key: 'lastcolonoscopy', width: 20 },
      { header: 'Cantidad Colonoscopias', key: 'cantcolonoscopy', width: 10},
      { header: 'Ultima Biopsia', key: 'lastbiopsy', width: 20},
      { header: 'Cantidad biopsias', key: 'cantbiopsy', width: 20 },
    ];
    
    this.dataSourcereports.data.forEach(e => {
      let row = worksheet.addRow({id_patient:e.idPatient,name: e.name,lastname: e.lastName, lastname2: e.lastName2, rut:e.rut,edad:e.edad,birthday: e.birthday, sex:e.sex, cellphone:e.cellphone,address:e.address,previcion:e.previcion,peso:e.peso,altura:e.altura,imc:e.imc, cmabdominal:e.cmabdominal,smokes: e.smokes, ncigarettes:e.ncigarettes,ysmoking:e.ysmoking , cancerdetectiondate: e.cancerdetectiondate, testresultcoloncheck:e.testresultcoloncheck, lastcoloncheck:e.lastcoloncheck,cantcoloncheck:e.cantcoloncheck,colonoscopy:e.colonoscopy, polyps:e.polyps,neoplasticlesion: e.neoplasticlesion,lastcolonoscopy:e.lastcolonoscopy,cantcolonoscopy: e.cantcolonoscopy, lastbiopsy: e.lastbiopsy, cantbiopsy:e.cantbiopsy}, "n");
    });
    titleRow.font = { name: 'calibri', family: 4, size: 12, bold: true, }
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };


    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'ReportePacientes.xlsx');
    })
  }
}


interface ColumnInterface {
  columnName: string,
  columnValue: string,
  cell: Function
}


