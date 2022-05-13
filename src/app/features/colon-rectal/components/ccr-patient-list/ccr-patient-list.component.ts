import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { CCRPatient } from 'src/app/features/colon-rectal/models/ccr-patient';
import { CCRPatientService } from 'src/app/features/colon-rectal/services/ccr-patient/ccr-patient.service';
import { DateTimeService } from 'src/app/core/services/date-time/date-time.service';
import { Subscription } from 'rxjs';
import { XlsxExporterService, } from 'mat-table-exporter';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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
  dataSourcereports!: MatTableDataSource<CCRPatient>;
  columnsJoin: ColumnInterface[] = [
    { columnName: 'Nombre', columnValue: 'name', cell: (element: CCRPatient): string => element.name + " " + element.lastName + " " + (element.lastName2??"") },
    { columnName: 'RUT', columnValue: 'rut', cell: (element: CCRPatient): string => element.rut ??this.NO_DATA },
    { columnName: 'COLON-CHECK', columnValue: 'coloncheckResult', cell: (element: CCRPatient): boolean => element.coloncheckResult },
    { columnName: 'COLONOSCOPÍA', columnValue: 'colonoscopyResult', cell: (element: CCRPatient): boolean => element.colonoscopyResult },
    { columnName: '', columnValue: 'expand', cell: (element: CCRPatient) => undefined },
  ];
  
  columnsToDisplay = this.columnsJoin.map(c => c.columnValue)

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  expandedElement!: CCRPatient | null;

  @Input() filter!: string;
  @Input() filter1!: string;
  filterMsg: string = '';

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

  exportToXlxs(): void{
    this.exportService.export(this.dataSourcereports.data)
  }


  exportToExcel(): void{
    this.saveASExcelFile(this.dataSourcereports, 'ReportePacientes')
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(json)
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveASExcelFile(excelBuffer, excelFileName);
  }
  private saveASExcelFile(buffer: any, filename: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    fs.saveAs(data, filename + EXCEL_EXTENSION)
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
     titleRow.font = { name: 'calibri', family: 4, size: 12, bold: true,  }
     

    worksheet.columns = [
      { header: 'Nombre', key: 'name', width: 20 },
      { header: 'Apellido Paterno', key: 'last_name', width: 20, },
      { header: 'Apellido Materno', key: 'last_name2', width: 20 },
      { header: 'Rut', key: 'rut', width: 15 },
      { header: 'Sexo', key: 'sex', width: 10 },
      { header: 'Nacionalidad', key: 'nacionality', width: 15 },
      { header: 'Fecha Nacimiento', key: 'birthday', width: 20 },
      { header: 'Telefono', key: 'cellphone', width: 13 },
      { header: 'Region', key: 'region', width: 15 },
      { header: 'Fonasa', key: 'fonasa', width: 15 },
      { header: 'Cesfam', key: 'cesfam', width: 17 },
      { header: 'Estado', key: 'state', width: 15 },
      { header: 'Fecha Deteccion Cancer ', key: 'cancer_detection_date', width: 25 },
      { header: 'Colon Check', key: 'coloncheck_result', width: 20 },
      { header: 'Colon Oscopia ', key: 'colonoscopy_result', width: 20 },
      { header: 'Fecha Ultima Colonoscopy ', key: 'test_date', width: 25 },
      { header: 'Polipos', key: 'polyps', width: 15 },
      { header: 'Lesion Neoplastica', key: 'neoplastic_lesion', width: 20 },
    ];
   
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('J1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('K1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('L1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('M1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('N1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('O1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('P1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('Q1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('R1').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('A1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('B1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('C1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('D1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('E1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('F1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('G1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('H1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('I1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('J1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('K1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('L1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('M1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('N1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('O1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('P1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('Q1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    worksheet.getCell('R1').fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'8852C1'},
    };
    

    this.dataSourcereports.data.forEach(e => {
      worksheet.addRow({name: e.name, last_name: e.lastName, last_name2: e.lastName2, rut:e.rut, sex:e.sex, nacionality: e.nationality, birthday:e.birthday, cellphone:e.cellphone, region:e.region, fonasa:e.fonasa, cesfam:e.cesfam, state: e.state, cancer_detection_date:e.cancerDetectionDate,coloncheck_result:e.coloncheckResult,colonoscopy_result:e.colonoscopyResult,polyps:e.polyps,neoplastic_lesion:e.neoplasticLesion},"n");
    });
   
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


