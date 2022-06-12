import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { CCREnrollmentSurvey } from 'src/app/features/colon-rectal/models/ccr-enrollment-survey';
import { CCRPatient } from 'src/app/features/colon-rectal/models/ccr-patient';
import { CCRPatientreports } from '../../models/ccr-reports';
import { CCRRiskSurveyFamily, CCRRiskSurveyFamilyCancer, CCRRiskSurveyGeneral, CCRRiskSurveyHabits, CCRRiskSurveyPathologies } from 'src/app/features/colon-rectal/models/ccr-risk-survey';
import { Coloncheck } from 'src/app/features/colon-rectal/models/coloncheck';
import { Colonoscopy } from 'src/app/features/colon-rectal/models/colonoscopy';
import { CustomHttpResponse } from 'src/app/core/models/http-response';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { CCRPatientSchedule } from '../../models/patient-schedule';
import { CCRBiopsy } from '../../models/ccr-biopsy';
import { map } from 'rxjs/operators';

const API = AppConstants.CCR_PATIENT_API

@Injectable()
export class CCRPatientService {

  constructor(private http: HttpClient) { }
  // CCR patients endpoints
  public getPatientById(patientId: number): Observable<CustomHttpResponse<CCRPatient[]>> {
    return this.http.post<CustomHttpResponse<CCRPatient[]>>(API + "GetPatientCCRById", { idPatient: patientId });
  }

  public updatePatient(data: CCRPatient): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdatePatientCCR", data);
  }

  public getAllCCRPatients(): Observable<CustomHttpResponse<CCRPatient[]>> {
    return this.http.get<CustomHttpResponse<CCRPatient[]>>(API + "GetListPatientCCR");
  }

  ////
  public getAllCCRPatientsForReports(): Observable<CustomHttpResponse<CCRPatientreports[]>> {
    return this.http.get<CustomHttpResponse<CCRPatientreports[]>>(API + "GetListPatientCCRForExport");
  }

  public deleteAllPatientByid(patientId: number): Observable<CustomHttpResponse<undefined>> {
    return this.http.delete<CustomHttpResponse<undefined>>(API + "deleteAllForPatient", { body: { idPatient: patientId} })
  }
  ///

  //enrollment survey
  public registerEnrollmentSurvey(data: CCREnrollmentSurvey): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterEnrollmentSurveyCCR", data);
  }

  public updateEnrollmentSurvey(data: CCREnrollmentSurvey): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateEnrollmentSurveyCCR", data);
  }

  public getAllEnrollmentSurveys(): Observable<CustomHttpResponse<CCREnrollmentSurvey[]>> {
    return this.http.get<CustomHttpResponse<CCREnrollmentSurvey[]>>(API + "GetListEnrollmentSurveyCCR")
  }

  public getPatientEnrollmentSurvey(id: number): Observable<CustomHttpResponse<CCREnrollmentSurvey[]>> {
    return this.http.post<CustomHttpResponse<CCREnrollmentSurvey[]>>(API + "GetEnrollmentSurveyByIdCCR", { idPatient: id });
  }

  // exams
  // cloncheck
  public addColonCheck(data: Coloncheck): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterColoncheck", data)
  }

  public getColoncheckList(id: number): Observable<CustomHttpResponse<Coloncheck[]>> {
    return this.http.post<CustomHttpResponse<Coloncheck[]>>(API + "GetListColoncheckById", { idPatient: id })
  }

  public deleteColoncheck(coloncheckId: number): Observable<CustomHttpResponse<undefined>> {
    return this.http.delete<CustomHttpResponse<undefined>>(API + "coloncheckDelete", { body: { idColoncheck: coloncheckId } })
  }
  // colonoscopy
  public addColonoscopy(data: Colonoscopy): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterColonoscopy", data);
  }

  public getColonoscopyList(patientId: number): Observable<CustomHttpResponse<Colonoscopy[]>> {
    return this.http.post<CustomHttpResponse<Colonoscopy[]>>(API + "GetListColonoscopyById", { idPatient: patientId });
  }

  public deleteColonoscopy(colonoscopyId: number): Observable<CustomHttpResponse<undefined>> {
    return this.http.delete<CustomHttpResponse<undefined>>(API + "colonoscopyDelete", { body: { idColonoscopy: colonoscopyId } })
  }
  // biopsy
  public addBiopsy(data: CCRBiopsy): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterBiopsyCCR", data)
  }

  public getBiopsyList(patientId: number): Observable<CustomHttpResponse<CCRBiopsy[]>> {
    return this.http.post<CustomHttpResponse<CCRBiopsy[]>>(API + "GetBiopsyByIdCCR", { idPatient: patientId })
  }

  public deleteBiopsy(biopsyId: number): Observable<CustomHttpResponse<undefined>> {
    return this.http.delete<CustomHttpResponse<undefined>>(API + "biopsyCCRDelete", { body: { idBiopsy: biopsyId } })
  }

  //patient risk survey
  //general
  public addGeneralRiskSurvey(data: CCRRiskSurveyGeneral): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterRiskSurveyBasic", data);
  }
  public updateGeneralRiskSurvey(data: CCRRiskSurveyGeneral): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateRiskSurveyBasic", data);
  }
  public getGeneralRiskSurvey(id: number): Observable<CustomHttpResponse<CCRRiskSurveyGeneral[]>> {
    return this.http.post<CustomHttpResponse<CCRRiskSurveyGeneral[]>>(API + "GetRiskSurveyBasicById", { idPatient: id })
  }

  //pathologies
  public addPathologiesRiskSurvey(data: CCRRiskSurveyPathologies): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterRiskSurveyPathologies", data);
  }
  public updatePathologiesRiskSurvey(data: CCRRiskSurveyPathologies): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateRiskSurveyPathologies", data);
  }
  public getPathologiesRiskSurvey(id: number): Observable<CustomHttpResponse<CCRRiskSurveyPathologies[]>> {
    return this.http.post<CustomHttpResponse<CCRRiskSurveyPathologies[]>>(API + "GetRiskSurveyPathologiesById", { idPatient: id });
  }

  //habits
  public addHabitsRiskSurvey(data: CCRRiskSurveyHabits): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterRiskSurveyHabits", data);
  }
  public updateHabitsRiskSurvey(data: CCRRiskSurveyHabits): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateRiskSurveyHabits", data);
  }
  public getHabitsRiskSurvey(id: number): Observable<CustomHttpResponse<CCRRiskSurveyHabits[]>> {
    return this.http.post<CustomHttpResponse<CCRRiskSurveyHabits[]>>(API + "GetRiskSurveyHabitsById", { idPatient: id });
  }

  //family background
  public addFamilyBackgroundRiskSurvey(data: CCRRiskSurveyFamily): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterRiskSurveyFamily", data);
  }

  public updateFamilyBackgroundRiskSurvey(data: CCRRiskSurveyFamily): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateRiskSurveyFamily", data);
  }

  public getFamilyBackgroundRiskSurvey(data: CCRRiskSurveyFamily): Observable<CustomHttpResponse<CCRRiskSurveyFamily[]>> {
    return this.http.post<CustomHttpResponse<CCRRiskSurveyFamily[]>>(API + "GetRiskSurveyFamilyById", data);
  }

  //family cancer
  public addFamilyCancerRiskSurvey(data: CCRRiskSurveyFamilyCancer): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterRiskSurveyFamilyCancer", data);
  }

  public updateFamilyCancerRiskSurvey(data: CCRRiskSurveyFamilyCancer): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateRiskSurveyFamilyCancer", data);
  }

  public getFamilyCancerRiskSurvey(patientId: number): Observable<CustomHttpResponse<CCRRiskSurveyFamilyCancer[]>> {
    return this.http.post<CustomHttpResponse<CCRRiskSurveyFamilyCancer[]>>(API + "GetRiskSurveyFamilyCancerById", { idPatient: patientId });
  }

  public deleteFamily(familyId: number): Observable<CustomHttpResponse<any>> {
    return this.http.delete<CustomHttpResponse<any>>(API + "familyDelete", { body: { idRiskSurveyFamilyCancer: familyId } })
  }

  // Complete survey
  public getCompleteRiskSurvey(patientId: number): Observable<RiskFork> {
    return forkJoin([
      this.getGeneralRiskSurvey(patientId),
      this.getHabitsRiskSurvey(patientId),
      this.getPathologiesRiskSurvey(patientId),
      this.getFamilyCancerRiskSurvey(patientId)
    ]).pipe(map(res => {
      return {
        general: res[0].data[0],
        habits: res[1].data[0],
        pathologies: res[2].data[0],
        family: res[3].data
      }
    }))
  }

  //get all patients scheduled by tracking every 2 years for colonoscopy
  public getScheduleTracking(): Observable<CustomHttpResponse<CCRPatientSchedule[]>> {
    return this.http.get<CustomHttpResponse<CCRPatientSchedule[]>>(API + "GetScheduleTracking")
  }

  //get all patients scheduled in registration for 
  public getScheduleOverdue(): Observable<CustomHttpResponse<CCRPatientSchedule[]>> {
    return this.http.get<CustomHttpResponse<CCRPatientSchedule[]>>(API + "GetScheduleOverdue")
  }

  //update contact state for overdue
  public updateContactOverdue(patientId: number, value: boolean, overlay = false): Observable<CustomHttpResponse<any>> {
    const params = new HttpParams().set('overlay', overlay);
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateScheduleContactOverdue", { idPatient: patientId, contact: value }, { params: params })
  }

  public updateContactTracking(patientId: number, value: boolean, overlay = false): Observable<CustomHttpResponse<any>> {
    const params = new HttpParams().set('overlay', overlay);
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateScheduleContactTracking", { id_patient: patientId, contact: value }, { params: params })
  }
}

interface RiskFork {
  general: CCRRiskSurveyGeneral,
  pathologies: CCRRiskSurveyPathologies,
  habits: CCRRiskSurveyHabits,
  family: CCRRiskSurveyFamilyCancer[];
}