import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CCRPatientService } from 'src/app/features/colon-rectal/services/ccr-patient/ccr-patient.service';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { Subscription } from 'rxjs';
import { CCRPatientreports } from 'src/app/features/colon-rectal/models/ccr-reports';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-ccr-reports',
  templateUrl: './ccr-reports-component.html',
  styleUrls: ['./ccr-reports-component.css']
})

export class ColonRectalReportsComponent implements AfterViewInit, OnDestroy {
  private sub$ = new Subscription()
  dataSourcereports!: MatTableDataSource<CCRPatientreports>;
  NO_TABLE_DATA = AppConstants.NO_TABLE_DATA
  private NO_DATA = AppConstants.NO_DATA;
  cantpacient!:number;
  checkcolonCountTrue!: number;
  pcloncheck!:number
  countpolyps!:number;
  cantfumadores!:number;
  pfumadores!:number;
  cantalcohol!:number;
  pcantalcohol!:number;
  ppolipos!:number;
  pppolipos!:number;
  pneoplastic!:number;
  ppneoplastic!:number;
  pcolonoscopy!:number;
  ppcolonosocpy!:number;
  pmayoranios!:number;
  ppmayoranios!:number;
  pestadorechazado!:number;
  pestadoinactivos!:number;
  ppestadorechazado!:number;
  pacientesm!:number;
  pacientesf!:number;
  noretornado!:number;
  pnoretornado!:number;
  numfonasa!:number;
  pnumfonasa!:number;
  numisapre!:number;
  pnumisapre!:number;
  pbiopsy!:number;
  ppbiopsy!:number;
  pdiabetes!:number;
  ppdiabetes!:number;
  ppepilepsy!:number;
  pepilepsy!:number;
  pgastriculcer!:number;
  ppgastriculcer!:number;
  phypo!:number;
  pphypo!:number;
  poperated!:number;
  ppoperated!:number;
  pcancer!:number;
  ppcancer!:number
  pextranjero!:number;
  ppextranjero!:number;
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

  constructor(private patientService: CCRPatientService,private breakpointObserver: BreakpointObserver) {

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
    this.sub$.add(this.patientService.getAllCCRPatientsForReports().subscribe(res => {
      const dataSourcereports = res.data;
      this.cantpacient = dataSourcereports.length;
      this.checkcolonCountTrue = dataSourcereports.filter(d => d.colontestresult).length
      this.pcloncheck = Math.round((this.checkcolonCountTrue/this.cantpacient)*100);
      this.cantfumadores = dataSourcereports.filter(d => d.smokes).length
      this.pfumadores = Math.round((this.cantfumadores/this.cantpacient)*100);
      this.ppolipos = dataSourcereports.filter(d => d.polyps).length
      this.pppolipos = Math.round((this.ppolipos/this.cantpacient)*100);
      this.pneoplastic = dataSourcereports.filter(d => d.neoplasticLesion).length
      this.ppneoplastic = Math.round((this.pneoplastic/this.cantpacient)*100);
      this.pcolonoscopy = dataSourcereports.filter(d => d.colonosresult).length
      this.ppcolonosocpy = Math.round((this.pcolonoscopy/this.cantpacient)*100);
      this.pmayoranios = dataSourcereports.filter(d => d.edad >= 56).length
      this.ppmayoranios = Math.round((this.pmayoranios/this.cantpacient)*100);
      this.pestadorechazado = dataSourcereports.filter(d => d.state == 'Rechazado' ).length
      this.pestadoinactivos = dataSourcereports.filter(d => d.state == 'Inactivo' ).length
      this.ppestadorechazado = Math.round((this.pestadorechazado + this.pestadoinactivos /this.cantpacient)*100);
      this.pacientesm = dataSourcereports.filter(d => d.sex== 'M').length
      this.pacientesf = dataSourcereports.filter(d => d.sex== 'F').length
      this.noretornado = dataSourcereports.filter(d => d.state == 'No Retornado').length
      this.pnoretornado = Math.round((this.noretornado/this.cantpacient)*100);
      this.numfonasa = dataSourcereports.filter(d => d.fonasa == 'Fonasa').length
      this.pnumfonasa = Math.round((this.numfonasa/this.cantpacient)*100);
      this.numisapre = dataSourcereports.filter(d => d.fonasa == 'Isapre').length
      this.pnumisapre = Math.round((this.numisapre/this.cantpacient)*100);
      this.cantalcohol = dataSourcereports.filter(d => d.drinkAlcohol).length
      this.pcantalcohol = Math.round((this.cantalcohol/this.cantpacient)*100);
      this.pbiopsy = dataSourcereports.filter(d => d.biopsydate).length
      this.ppbiopsy = Math.round((this.pbiopsy/this.cantpacient)*100);
      this.pdiabetes = dataSourcereports.filter(d => d.diabetes).length
      this.ppdiabetes = Math.round((this.pdiabetes/this.cantpacient)*100);
      this.pepilepsy = dataSourcereports.filter(d => d.epilepsy).length
      this.ppepilepsy = Math.round((this.pepilepsy/this.cantpacient)*100);
      this.pgastriculcer = dataSourcereports.filter(d => d.gastricUlcer).length
      this.ppgastriculcer = Math.round((this.pgastriculcer/this.cantpacient)*100);
      this.phypo = dataSourcereports.filter(d => d.hypoHyperThyroidism).length
      this.pphypo = Math.round((this.phypo/this.cantpacient)*100);
      this.poperated = dataSourcereports.filter(d => d.operated).length
      this.ppoperated = Math.round((this.poperated/this.cantpacient)*100);
      this.pcancer = dataSourcereports.filter(d => d.cancer).length
      this.ppcancer = Math.round((this.pcancer/this.cantpacient)*100);
      this.pextranjero = dataSourcereports.filter(d => d.extranjero).length
      this.ppextranjero = Math.round((this.pextranjero/this.cantpacient)*100);
    }, err => {
      this.dataSourcereports = new MatTableDataSource();
      this.NO_TABLE_DATA = AppConstants.NO_TABLE_DATA_ERROR;
    }))
  }


}