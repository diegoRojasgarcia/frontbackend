import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { CustomHttpResponse } from 'src/app/core/models/http-response';
import { ValidationService } from 'src/app/core/services/validation/validation.service';
import { CancerCheck, Patient } from 'src/app/features/patient/models/patient';

const API = AppConstants.PATIENT_API

@Injectable()
export class PatientService {
  constructor(private http: HttpClient, private valSvc: ValidationService) { }

  public addPatient(patient: Patient): Observable<CustomHttpResponse<any>> {
    patient.rut = this.valSvc.cleanRut(patient.rut)
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterPatient", patient);
  }

  public updatePatient(patient: Patient): Observable<CustomHttpResponse<any>> {
    patient.rut = this.valSvc.cleanRut(patient.rut)
    return this.http.put<CustomHttpResponse<any>>(API + "UpdatePatient", patient);
  }

  public getAllPatients(): Observable<CustomHttpResponse<Patient[]>> {
    return this.http.get<CustomHttpResponse<Patient[]>>(API + "GetPatients");
  }

  public getPatient(id: number): Observable<CustomHttpResponse<Patient[]>> {
    return this.http.post<CustomHttpResponse<Patient[]>>(API + "GetPatientById", { idPatient: id });
  }

  
  public getPatientByRUT(patientRut: number): Observable<CustomHttpResponse<Patient>> {
    return this.http.post<CustomHttpResponse<Patient>>(API + "GetPatientsByRut", { rut: patientRut });
  }

  public getPatientCancerByRUT(patientRut: string): Observable<CustomHttpResponse<CancerCheck[]>> {
    return this.http.post<CustomHttpResponse<CancerCheck[]>>(API + "GetPatientsCancerByRut", { rut: patientRut })
  }

  public deletePatientByid(patientRut: string): Observable<CustomHttpResponse<CancerCheck[]>> {
    return this.http.post<CustomHttpResponse<CancerCheck[]>>(API + "deleteAllForPatient", { id: patientRut })
  }

  public deleteAllPatientByid(patientId: number): Observable<CustomHttpResponse<undefined>> {
    return this.http.delete<CustomHttpResponse<undefined>>(API + "deleteAllForPatient", { body: { idPatient: patientId} })
  }


}
