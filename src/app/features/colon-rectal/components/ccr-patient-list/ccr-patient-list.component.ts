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
          this.filterMsg = 'Filtro: COLONTEST-POSITIVO'
          return data.coloncheckResult === true
        case '2':
          this.filterMsg = 'Filtro: COLONTEST-NEGATIVO'
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
      { header: 'id', key: 'idPatient', width: 6},
      { header: 'Estado', key: 'state', width: 10},
      { header: 'Nombre', key: 'name', width: 20},
      { header: 'Apellido Paterno', key: 'lastName', width: 20, },
      { header: 'Apellido Materno', key: 'lastName2', width: 20 },
      { header: 'Rut', key: 'rut', width: 15 },
      { header: 'Edad', key: 'edad', width: 6 },
      { header: 'Fecha Nacimiento', key: 'birthday', width: 20 },
      { header: 'Sexo', key: 'sex', width: 5},
      { header: 'Teléfono', key: 'cellphone', width: 10 },
      { header: 'Teléfono Emergencia', key: 'emergencyPhone', width: 10 },
      { header: 'Email', key: 'mail', width: 16 },
      { header: 'Dirección', key: 'address', width: 20 },
      { header: 'Villa', key: 'village', width: 20 },
      { header: 'Prevision', key: 'fonasa', width: 10 },
      { header: 'Peso (kg)', key: 'weight', width: 10},
      { header: 'Altura (cm)', key: 'height', width: 15},
      { header: 'IMC', key: 'imc', width: 5},
      { header: 'C. Abdominal', key: 'cAbdominal', width: 15},
      { header: 'Fumador', key: 'smokes', width: 15},
      { header: 'Alcohol', key: 'drinkAlcohol', width: 15},
      { header: 'Operado', key: 'operated', width: 15},
      { header: 'Cáncer', key: 'cancer', width: 25 },
      { header: 'Colon Test', key: 'colontestresult', width: 20 },
      { header: 'Ultimo ColonTest', key: 'fechacolontest', width: 20},
      { header: 'Colon Oscopia', key: 'colonosresult', width: 13},
      { header: 'Polipos', key: 'polyps', width: 13},
      { header: 'Lesion Neoplastica', key: 'neoplasticLesion', width: 13},
      { header: 'Última Colonosocopia', key: 'fechacolonoscopy', width: 20 },
      { header: 'Última Biopsia', key: 'biopsydate', width: 20},
    ];
    
    this.dataSourcereports.data.forEach(e => {
      let row = worksheet.addRow({idPatient:e.idPatient,state:e.state,name: e.name,lastName: e.lastName,lastName2:e.lastName2, rut:e.rut,edad:e.edad,birthday: e.birthday, sex:e.sex, cellphone:e.cellphone,emergencyPhone:e.emergencyPhone,mail:e.mail,address:e.address,village:e.village,fonasa:e.fonasa,weight:e.weight,height:e.height,imc:e.imc, cAbdominal:e.cAbdominal,smokes: e.smokes,drinkAlcohol:e.drinkAlcohol, operated:e.operated,cancer: e.cancer, colontestresult:e.colontestresult, fechacolontest:e.fechacolontest,colonosresult:e.colonosresult, polyps:e.polyps,neoplasticLesion: e.neoplasticLesion,fechacolonoscopy:e.fechacolonoscopy, biopsydate: e.biopsydate}, "n");
    });
    titleRow.font = { name: 'calibri', family: 4, size: 12, bold: true, }
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };


    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'ReportePacientesModuloColoRectal.xlsx');
    })
  }
}


interface ColumnInterface {
  columnName: string,
  columnValue: string,
  cell: Function
}


