import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { CustomHttpResponse } from 'src/app/core/models/http-response';
import { Privilege, Speciality } from 'src/app/features/users-management/models/privilege';
import { Region } from 'src/app/core/models/region';
import { ScreeningSurveyQuestion } from 'src/app/core/models/ScreeningSurveyQuestion';
import { Profession } from 'src/app/features/users-management/models/profession';
import { map, shareReplay } from 'rxjs/operators';
import { Specialization } from 'src/app/features/users-management/models/specialization';
import { CBPBiopsyType } from 'src/app/features/bronchopulmonary/models/cbp-exams';

const API = AppConstants.ADMIN_API;
const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class AdministrativeService {
  private patient$!: Observable<any>;
  private user$!: Observable<any>;
  private biopsy$!: Observable<any>;
  private cbpS$!: Observable<any>;
  private ccrS$!: Observable<any>;

  constructor(private http: HttpClient) { }

  public getRegions(): Observable<CustomHttpResponse<Region[]>> {
    return this.http.get<CustomHttpResponse<Region[]>>(API + AppConstants.getRegionsEndpoint).pipe(shareReplay(CACHE_SIZE));
  }

  public getCommuneByRegion(regionCode: string): Observable<CustomHttpResponse<Region[]>> {
    const params = new HttpParams().set('overlay', false);
    return this.http.post<CustomHttpResponse<Region[]>>(API + AppConstants.getCommuneByRegion, { codigo: regionCode }, { params: params }).pipe(shareReplay(CACHE_SIZE));
  }

  public getCCRSurvey(): Observable<CustomHttpResponse<ScreeningSurveyQuestion[]>> {
    if (!this.ccrS$)
      this.ccrS$ = this.http.get<CustomHttpResponse<ScreeningSurveyQuestion[]>>(API + AppConstants.getCCREnrollmentSurvey).pipe(shareReplay(CACHE_SIZE));
    return this.ccrS$
  }

  public getCBPSurvey(): Observable<CustomHttpResponse<ScreeningSurveyQuestion[]>> {
    if (!this.cbpS$)
      this.cbpS$ = this.http.get<CustomHttpResponse<ScreeningSurveyQuestion[]>>(API + AppConstants.getCBPEnrollmentSurvey).pipe(shareReplay(CACHE_SIZE));
    return this.cbpS$;
  }

  public getProfessions(): Observable<CustomHttpResponse<Profession[]>> {
    return this.http.get<CustomHttpResponse<Profession[]>>(API + "GetProfession").pipe(shareReplay(CACHE_SIZE));
  }

  public getPrivileges(): Observable<CustomHttpResponse<Privilege[]>> {
    return this.http.get<CustomHttpResponse<Privilege[]>>(API + "GetPrivilege").pipe(shareReplay(CACHE_SIZE));
  }

  public getSpecializations(): Observable<CustomHttpResponse<Specialization[]>> {
    return this.http.get<CustomHttpResponse<Specialization[]>>(API + "GetSpecialization").pipe(shareReplay(CACHE_SIZE));
  }

  public getNationality(): Observable<string[]> {
    return this.http.get<CustomHttpResponse<{ gentilicioNac: string }[]>>(API + "GetNationality").pipe(map(e => e.data.map(g => g.gentilicioNac)), shareReplay(CACHE_SIZE));
  }

  public getFonasa(): Observable<string[]> {
    return this.http.get<CustomHttpResponse<{ stretch: string }[]>>(API + "GetFonasa").pipe(map(e => e.data.map(f => f.stretch)), shareReplay(CACHE_SIZE))
  }

  public getCesfams(): Observable<string[]> {
    return this.http.get<CustomHttpResponse<{ cesfam: string }[]>>(API + "GetCesfam").pipe(map(e => e.data.map(c => c.cesfam)), shareReplay(CACHE_SIZE))
  }

  public getMaritalStatus(): Observable<string[]> {
    return this.http.get<CustomHttpResponse<{ status: string }[]>>(API + "GetMaritalStatus").pipe(map(e => e.data.map(m => m.status)), shareReplay(CACHE_SIZE))
  }

  public getPActivity(): Observable<string[]> {
    return this.http.get<CustomHttpResponse<{ activity: string }[]>>(API + "GetPActivity").pipe(map(e => e.data.map(a => a.activity)), shareReplay(CACHE_SIZE))
  }

  public getAlcohol(): Observable<string[]> {
    return this.http.get<CustomHttpResponse<{ alcohol: string }[]>>(API + "GetAlcohol").pipe(map(e => e.data.map(a => a.alcohol)), shareReplay(CACHE_SIZE))
  }

  public getUserSelectData(): Observable<UserFork> {
    if (!this.user$)
      this.user$ = forkJoin([this.getSpecializations(), this.getPrivileges(), this.getProfessions()]).pipe(map(res => {
        return { specializations: res[0].data, privileges: res[1].data, prefessions: res[2].data }
      }));
    return this.user$;
  }

  public getPatientSelectData(): Observable<PatientFork> {
    if (!this.patient$)
      this.patient$ = forkJoin([this.getRegions(), this.getNationality(), this.getFonasa(), this.getCesfams(), this.getMaritalStatus(), this.getPActivity()]).pipe(map(res => {
        return {
          regions: res[0].data,
          nationalities: res[1],
          fonasa: res[2],
          cesfams: res[3],
          maritalStates: res[4],
          pcactivitys: res[5]
        }
      }));
    return this.patient$;
  }

  public getBiopsyTypes(): Observable<CustomHttpResponse<CBPBiopsyType[]>> {
    if (!this.biopsy$)
      this.biopsy$ = this.http.get(API + "GetBiopsyType").pipe(shareReplay(CACHE_SIZE));
    return this.biopsy$;
  }

}
interface PatientFork {
  regions: Region[],
  nationalities: string[],
  cesfams: string[],
  fonasa: string[],
  maritalStates: string[],
  pcactivitys: string[],
  alcoholList: string[]
}
interface UserFork {
  prefessions: Profession[];
  privileges: Privilege[];
  specializations: Specialization[];
}