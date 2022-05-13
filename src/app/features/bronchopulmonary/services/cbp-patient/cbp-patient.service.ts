import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CBPEnrollmentSurvey } from 'src/app/features/bronchopulmonary/models/cbp-enrollment-survey';
import { CBPBiopsy, CBPBiopsyType, TAC } from 'src/app/features/bronchopulmonary/models/cbp-exams';
import { CBPPatient } from 'src/app/features/bronchopulmonary/models/cbp-patient';
import { CustomHttpResponse } from 'src/app/core/models/http-response';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { TACTrackingPatient } from '../../models/cbp-tracking';

const API = AppConstants.CBP_PATIENT_API

@Injectable()
export class CBPPatientService {


  constructor(private http: HttpClient) { }

  registerEnrollmentSurvey(data: CBPEnrollmentSurvey): Observable<CustomHttpResponse<any>> {
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterEnrollmentSurveyCBP", data)
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

  updatePatient(data: CBPPatient): Observable<CustomHttpResponse<any>>{
    return this.http.put<CustomHttpResponse<any>>(API+"UpdatePatientCBP", data);
  }
}
