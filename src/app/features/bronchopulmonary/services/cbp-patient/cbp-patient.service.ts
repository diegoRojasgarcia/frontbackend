import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CBPEnrollmentSurvey } from 'src/app/features/bronchopulmonary/models/cbp-enrollment-survey';
import { CBPBiopsy, CBPBiopsyType, TAC } from 'src/app/features/bronchopulmonary/models/cbp-exams';
import { CBPPatient } from 'src/app/features/bronchopulmonary/models/cbp-patient';
import { CustomHttpResponse } from 'src/app/core/models/http-response';
import { cbpStatistics } from 'src/app/features/bronchopulmonary/models/cbp-statistics';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { TACTrackingPatient } from '../../models/cbp-tracking';
import { CBPPatientReports } from 'src/app/features/bronchopulmonary/models/cbp-reports'
import { forkJoin } from 'rxjs';
import { CBPRiskSurveyFamilyCancer, CBPRiskSurveyGeneral, CBPRiskSurveyHabits, CBPRiskSurveyPathologies } from 'src/app/features/bronchopulmonary/models/cbp-risk-survey';
import { map,shareReplay } from 'rxjs/operators';
import { alcohol } from 'src/app/features/users-management/models/alcohol';

const API = AppConstants.CBP_PATIENT_API
const CACHE_SIZE = 1;

@Injectable()
export class CBPPatientService {


  constructor(private http: HttpClient) { }

  registerEnrollmentSurvey(data: CBPEnrollmentSurvey): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterEnrollmentSurveyCBP", data)
  }

  public getAlcohol(): Observable<CustomHttpResponse<alcohol[]>> {
    return this.http.get<CustomHttpResponse<alcohol[]>>(API + "GetAlcohol").pipe(shareReplay(CACHE_SIZE));
  }

  getEnrollmentSurvey(patientId: number): Observable<CustomHttpResponse<CBPEnrollmentSurvey[]>> {
    return this.http.post<CustomHttpResponse<CBPEnrollmentSurvey[]>>(API+"GetEnrollmentSurveyByIdCBP", { idPatient: patientId })
  }

  updateEnrollmentSurvey(data: CBPEnrollmentSurvey): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateEnrollmentSurveyCBP", data);
  }

  getAllCBPPAtients(): Observable<CustomHttpResponse<CBPPatient[]>> {
    return this.http.get<CustomHttpResponse<CBPPatient[]>>(API + "GetListPatientCBP")
  }

  getAllCBPPAtientsReports(): Observable<CustomHttpResponse<CBPPatientReports[]>> {
    return this.http.get<CustomHttpResponse<CBPPatientReports[]>>(API + "GetListPatientCBPReports")
  }

  getAllCBPPAtientsStadistics(): Observable<CustomHttpResponse<cbpStatistics[]>> {
    return this.http.get<CustomHttpResponse<cbpStatistics[]>>(API + "GetListPatientCBPStatistics")
  }

  getCBPPatientById(patientId: number): Observable<CustomHttpResponse<CBPPatient[]>> {
    return this.http.post<CustomHttpResponse<CBPPatient[]>>(API + "GetPatientCBPById", { idPatient: patientId })
  }

  addTAC(data: TAC): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterTAC", data)
  }

  removeTAC(id: number): Observable<CustomHttpResponse<any>> {
    return this.http.delete<CustomHttpResponse<any>>(API + "ldctDelete", { body: { idLdct: id } })
  }

  getPatientTACList(patientId: number): Observable<CustomHttpResponse<TAC[]>> {
    return this.http.post<CustomHttpResponse<any>>(API + "GetListTACById", { idPatient: patientId });
  }

  getTacList(): Observable<CustomHttpResponse<TAC[]>> {
    return this.http.get<CustomHttpResponse<TAC[]>>(API + "GetListTAC")
  }

  getCBPByopsyType(): Observable<CustomHttpResponse<CBPBiopsyType[]>> {
    return this.http.get<CustomHttpResponse<CBPBiopsyType[]>>(API + "GetBiopsyType")
  }

  addCBPBiopsy(data: CBPBiopsy): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterBiopsyCBP", data)
  }

  removeCBPBiopsy(id: number): Observable<CustomHttpResponse<any>> {
    return this.http.delete<CustomHttpResponse<any>>(API + "biopsyCBPDelete", { body: { idBiopsy: id } })
  }

  getPatientBiopsyList(patientId: number): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "GetBiopsyByIdCBP", { idPatient: patientId })
  }

  getTACTrackingList(): Observable<CustomHttpResponse<TACTrackingPatient[]>> {
    return this.http.get<CustomHttpResponse<TACTrackingPatient[]>>(API + "GetScheduleTrackingLungRADS");
  }

  updateTrackingContact(patientId: number, value: boolean): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateContactLungRads", { id_patient: patientId, contact: value });
  }

  public updatePatient(data: CBPPatient): Observable<CustomHttpResponse<any>>{
    return this.http.put<CustomHttpResponse<any>>(API+"UpdatePatientCBP", data);
  }

  //patient risk survey
  //general
  public addGeneralRiskSurvey(data: CBPRiskSurveyGeneral): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterRiskSurveyBasic", data);
  }
  public updateGeneralRiskSurvey(data: CBPRiskSurveyGeneral): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateRiskSurveyBasic", data);
  }
  public getGeneralRiskSurvey(id: number): Observable<CustomHttpResponse<CBPRiskSurveyGeneral[]>> {
    return this.http.post<CustomHttpResponse<CBPRiskSurveyGeneral[]>>(API + "GetRiskSurveyBasicById", { idPatient: id })
  }

  //pathologies
  public addPathologiesRiskSurvey(data: CBPRiskSurveyPathologies): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterRiskSurveyPathologies", data);
  }
  public updatePathologiesRiskSurvey(data: CBPRiskSurveyPathologies): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateRiskSurveyPathologies", data);
  }
  public getPathologiesRiskSurvey(id: number): Observable<CustomHttpResponse<CBPRiskSurveyPathologies[]>> {
    return this.http.post<CustomHttpResponse<CBPRiskSurveyPathologies[]>>(API + "GetRiskSurveyPathologiesById", { idPatient: id });
  }

  //Habits
  public addHabitsRiskSurvey(data: CBPRiskSurveyHabits): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterRiskSurveyHabits", data);
  }
  public updateHabitsRiskSurvey(data: CBPRiskSurveyHabits): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateRiskSurveyHabits", data);
  }
  public getHabitsRiskSurvey(id: number): Observable<CustomHttpResponse<CBPRiskSurveyHabits[]>> {
    return this.http.post<CustomHttpResponse<CBPRiskSurveyHabits[]>>(API + "GetRiskSurveyHabitsById", { idPatient: id });
  }

  //Family cancer
  //family cancer
  public addFamilyCancerRiskSurvey(data: CBPRiskSurveyFamilyCancer): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterRiskSurveyFamilyCancer", data);
  }

  public updateFamilyCancerRiskSurvey(data: CBPRiskSurveyFamilyCancer): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateRiskSurveyFamilyCancer", data);
  }

  public getFamilyCancerRiskSurvey(patientId: number): Observable<CustomHttpResponse<CBPRiskSurveyFamilyCancer[]>> {
    return this.http.post<CustomHttpResponse<CBPRiskSurveyFamilyCancer[]>>(API + "GetRiskSurveyFamilyCancerById", { idPatient: patientId });
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


}

interface RiskFork {
  general: CBPRiskSurveyGeneral,
  pathologies: CBPRiskSurveyPathologies,
  habits: CBPRiskSurveyHabits,
  family: CBPRiskSurveyFamilyCancer[];
}
