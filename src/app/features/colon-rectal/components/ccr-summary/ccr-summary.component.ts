import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { CCRPatientSchedule } from 'src/app/features/colon-rectal/models/patient-schedule';
import { CCRPatientService } from '../../services/ccr-patient/ccr-patient.service';


@Component({
  selector: 'app-ccr-summary',
  templateUrl: './ccr-summary.component.html',
  styleUrls: ['./ccr-summary.component.css']
})
export class ColonRectalSummaryComponent implements AfterViewInit, OnDestroy {
  private subs$ = new Subscription()


  displayedColumns: string[] = ['state', 'name', 'cellphone', 'mail', 'emergencyContact'];
  pendingPatients!: MatTableDataSource<CCRPatientSchedule>;
  examPatients!: MatTableDataSource<CCRPatientSchedule>;
  pendingCount!: number;
  examsCount!: number;
  @ViewChild('PendingsTablePaginator', { static: true }) pendingsPaginator!: MatPaginator;
  @ViewChild('PendingsTableSort', { static: true }) pendingsSort!: MatSort;
  @ViewChild('ExamsTablePaginator', { static: true }) examsPaginator!: MatPaginator;
  @ViewChild('ExamsTableSort', { static: true }) examsSort!: MatSort;

  @Input() filter: string = "";

  pageSizeOptions: number[] = AppConstants.pageSizeOptions;

  NO_DATA_1 = AppConstants.NO_TABLE_DATA;
  NO_DATA_2 = AppConstants.NO_TABLE_DATA;

  constructor(private scheduleService: CCRPatientService, private auth: AuthenticationService) { }

  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }

  ngAfterViewInit() {
    this.subs$.add(this.scheduleService.getScheduleOverdue().subscribe(res => {
      const pendings = res.data
      this.pendingPatients = new MatTableDataSource(pendings);
      this.pendingCount = pendings.filter(pending => !pending.contact).length
      this.pendingPatients.paginator = this.pendingsPaginator;
      this.pendingPatients.sort = this.pendingsSort;
    }, err => {
      const data: CCRPatientSchedule[] = [];
      this.NO_DATA_1 = AppConstants.NO_TABLE_DATA_ERROR
      this.pendingPatients = new MatTableDataSource(data);
    }));

    this.subs$.add(this.scheduleService.getScheduleTracking().subscribe(res => {
      const exams = res.data;
      this.examPatients = new MatTableDataSource(exams);
      this.examsCount = exams.filter(exam => !exam.contact).length;
      this.examPatients.paginator = this.examsPaginator;
      this.examPatients.sort = this.examsSort;
    }, err => {
      this.NO_DATA_2 = AppConstants.NO_TABLE_DATA_ERROR
      const data: CCRPatientSchedule[] = [];
      this.examPatients = new MatTableDataSource(data);
    }));
  }

  /**
   * Search on the table by the given string.
   */
  applyFilter() {
    const filterValue = this.filter;
    this.pendingPatients.filter = filterValue.trim().toLowerCase();
    this.examPatients.filter = filterValue.trim().toLowerCase();

    if (this.pendingPatients.paginator)
      this.pendingPatients.paginator.firstPage();

    if (this.examPatients.paginator)
      this.examPatients.paginator.firstPage();
  }

  /**
   * Changes the contact state of the selected row.
   * 
   * @param check   The new state value.
   * @param row     The row data to be changed.
   */
  updatePendings(check: boolean, row: CCRPatientSchedule): void {
    row.contact = null;
    if (row.idPatient)
      this.subs$.add(this.scheduleService.updateContactOverdue(row.idPatient, check).subscribe(res => {
        row.contact = check;
        if (check)
          this.pendingCount--;
        else
          this.pendingCount++;
      }, err => row.contact = !check))

  }

  /**
   * Changes the contact state of the selected row.
   * 
   * @param check   The new state value.
   * @param row     The row data to be changed.
   */
  updateContactTracking(check: boolean, row: CCRPatientSchedule): void {
    row.contact = null;
    if (row.idPatient)
      this.subs$.add(this.scheduleService.updateContactTracking(row.idPatient, check).subscribe(res => {
        row.contact = check;
        if (check)
          this.examsCount--;
        else
          this.examsCount++;
      }, err => row.contact = !check))
  }
}