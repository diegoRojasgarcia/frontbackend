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
import { cbpStatistics } from 'src/app/features/bronchopulmonary/models/cbp-statistics';
import { Features, Permission } from 'src/app/features/users-management/models/privilege';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
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
  private NO_DATA = AppConstants.NO_DATA;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSizeOptions: number[] = AppConstants.pageSizeOptions;
  expandedElement: CBPPatient | null = null;

  private NO_VALUE: string = "No Informado"
  NO_TABLE_DATA: string = AppConstants.NO_TABLE_DATA;

  columnsJoin: ColumnInterface[] = [
    { columnValue: 'name', columnName: 'Nombre', cell: (row: CBPPatient) => row.name + " " + row.lastName + " " + (row.lastName2 ? row.lastName2 : '') },
    { columnValue: 'work', columnName: 'Profesi??n de Riesgo', cell: (row: CBPPatient) => row.riskProfession },
    { columnValue: 'tacCounter', columnName: "Contador TAC", cell: (row: CBPPatient) => row.tacCounter ? row.tacCounter : this.NO_VALUE },
    { columnValue: 'state', columnName: 'Derivaci??n', cell: (row: CBPPatient) => row.derivationStateNfm ? row.derivationStateNfm : this.NO_VALUE },
    { columnValue: 'rads', columnName: 'LUNG RADS', cell: (row: CBPPatient) => row.lungRads ? row.lungRads : this.NO_VALUE },
    { columnValue: 'estado', columnName: 'Estado paciente', cell: (row: CBPPatient) => row.state },
    { columnValue: 'expand', columnName: '', cell: (row: CBPPatient) => undefined },
  ];

  columnsToDisplay: string[] = this.columnsJoin.map(e => e.columnValue)

  PERMISSIONS = Permission;
  FEATURES = Features;

  dataSource!: MatTableDataSource<CBPPatient>;
  dataSourceReports!: MatTableDataSource<cbpStatistics>

  @Input() filter!: string;
  @Input() filter1!: string;

  @Output() openProfile: EventEmitter<number> = new EventEmitter<number>()

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

    this.subs$.add(this.cbpPatientService.getAllCBPPAtientsStadistics().subscribe(res => {
      this.dataSourceReports = new MatTableDataSource(res.data);
    }, err => {
      const data: CBPPatient[] = [];
      this.NO_TABLE_DATA = AppConstants.NO_TABLE_DATA_ERROR;
    }))
  }
  /**
   * Handles the patient profile opening.
   * 
   * Emits the patient id of the user selected.
   * 
   *
   */
   handleProfile(patientId: number) {
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

  exportExcel() {

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Pacientes Broncopulmonar');

    //Add Row and formatting
    let titleRow = worksheet.addRow(['']);
    
    worksheet.columns = [
      { header: 'id Paciente', key: 'idpatient', width: 15, },
      { header: 'Estado', key: 'state', width: 20 , },
      { header: 'Rut', key: 'rut', width: 13 },
      { header: 'Nombre', key: 'name', width: 20 , },
      { header: 'Apellido Paterno', key: 'lastname', width: 20, },
      { header: 'Apellido Materno', key: 'lastname2', width: 20 },
      { header: 'Sexo', key: 'sex', width: 5},
      { header: 'Edad', key: 'edad', width: 6 },
      { header: 'Fecha Nacimiento', key: 'birthday', width: 20 },
      { header: 'Telefono', key: 'cellphone', width: 13},
      { header: 'Telefono e.', key: 'ephone', width: 12},
      { header: 'Mail', key: 'mail', width: 13 },
      { header: 'Previcion', key: 'fonasa', width: 13},
      { header: 'Cesfam', key: 'cesfam', width: 15},
      { header: 'Direccion', key: 'address', width: 15},
      { header: 'Villa', key: 'village', width: 15},
      { header: 'Derivacion', key: 'derivacion', width: 13},
      { header: 'Peso', key: 'weight', width: 13},
      { header: 'Altura', key: 'hegith', width: 13},
      { header: 'Imc', key: 'imc', width: 13},
      { header: 'C. Abdominal', key: 'cabdomen', width: 13},
      { header: 'P. Sist??lica', key: 'pasystolic', width: 13},
      { header: 'P. Diast??lica', key: 'padiastolic', width: 13},
      { header: 'Fumador', key: 'smokes', width: 13},
      { header: 'Alcohol', key: 'drinkalcohol', width: 13},
      { header: 'Diabetes', key: 'diabetes', width: 13},
      { header: 'Epilepsia', key: 'epilepsy', width: 13},
      { header: 'Ulcera', key: 'gastricul', width: 13},
      { header: 'Hipotiroidismo', key: 'hypo', width: 13},
      { header: 'LRads', key: 'lrads', width: 13},
      { header: 'Nodulo', key: 'nodule', width: 13},
      { header: 'Tama??o', key: 'size', width: 13},
      { header: 'Biopsia', key: 'lastbiopsy', width: 13},
    ];

    this.dataSourceReports.data.forEach(e => {
      let row = worksheet.addRow({ idpatient:e.idpatient, state:e.state,rut:e.rut,name:e.name,lastname:e.lastname,lastname2:e.lastname2,sex:e.sex,edad:e.edad,birthday:e.birthday,cellphone:e.cellphone, ephone:e.ephone,mail:e.mail,fonasa:e.fonasa, cesfam:e.cesfam,address:e.address,village:e.village, derivacion:e.derivacion,weight:e.weight, height:e.height, imc:e.imc, cabdomen:e.cabdomen, pasystolic:e.pasystolic, padiastolic:e.padiastolic, smokes:e.smokes, drinkalcohol:e.drinkalcohol, diabetes:e.diabetes,epilepsy:e.epilepsy, gastricul:e.gastricul,  hypo:e.hypo, lrads:e.lrads, nodule:e.nodule, size:e.size,lastbiopsy:e.lastbiopsy  }, "n");
    });

    titleRow.font = { name: 'calibri', family: 4, size: 12, bold: true, }
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
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'ReportePacientesBroncopulmonar.xlsx');
    })
  }

}




interface ColumnInterface {
  columnValue: string;
  columnName: string;
  cell: Function;
}
