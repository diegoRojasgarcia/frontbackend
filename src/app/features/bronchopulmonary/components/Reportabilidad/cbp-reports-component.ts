import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CBPPatientService } from 'src/app/features/bronchopulmonary/services/cbp-patient/cbp-patient.service';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { Subscription } from 'rxjs';
import { CBPPatientReports } from 'src/app/features/bronchopulmonary/models/cbp-reports';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-cbp-reports',
  templateUrl: './cbp-reports-component.html',
  styleUrls: ['./cbp-reports-component.css']
})

export class PatientCBPReports implements AfterViewInit, OnDestroy {

  private sub$ = new Subscription()
  dataSourcereports!: MatTableDataSource<CBPPatientReports>;
  NO_TABLE_DATA = AppConstants.NO_TABLE_DATA
  private NO_DATA = AppConstants.NO_DATA;
  cantpacient!:number;
     // @ViewChild('grid') grid: MatGridList;
  // @ViewChild('grid') grid: MatGridList;
  cols = 2;
  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  }
 
  constructor(private patientService: CBPPatientService,private breakpointObserver: BreakpointObserver) { 

    this.sub$.add(this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = this.gridByBreakpoint.sm;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = this.gridByBreakpoint.sm;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = this.gridByBreakpoint.lg;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = this.gridByBreakpoint.xl;
        }
      }
    }));

  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  ngAfterViewInit() {
    this.sub$.add(this.patientService.getAllCBPPAtientsReports().subscribe(res => {
      const dataSourcereports = res.data;
      this.cantpacient = dataSourcereports.length;
    }, err => {
      this.dataSourcereports = new MatTableDataSource();
      this.NO_TABLE_DATA = AppConstants.NO_TABLE_DATA_ERROR;
    }))

    
  }

    
}