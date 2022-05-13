import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { CBPEnrollmentSchedule } from 'src/app/features/bronchopulmonary/models/cbp-tracking';
import { CustomHttpResponse } from 'src/app/core/models/http-response';
import { RangeCache } from 'src/app/features/scheduling/models/range-cache';
import { map, shareReplay } from 'rxjs/operators';
import { DateTimeService } from 'src/app/core/services/date-time/date-time.service';

const API: string = AppConstants.CBP_SCHEDULING_API;
const CACHE_SIZE = 1;

@Injectable()
export class CBPSchedulingService {
  private ranges$: RangeCache[]=[];

  constructor(private http: HttpClient, private dtService: DateTimeService) { }

  

  addEnrollmentSchedule(data:CBPEnrollmentSchedule):Observable<CustomHttpResponse<any>>{
    return this.http.post<CustomHttpResponse<any>>(API+"RegisterSchedule", data)
  }

  updateEnrollmentSchedule(data:CBPEnrollmentSchedule):Observable<CustomHttpResponse<any>>{
    return this.http.put<CustomHttpResponse<any>>(API+"UpdateSchedule", data)
  }

  //get all the appointments in a givven date range (date must be in ISO)
  public getScheduleRange(range: Interval[]): Observable<CBPEnrollmentSchedule[]> {
    return forkJoin(range.map(r => this.getRangedSchedule(r))).pipe(map(res => {
      let data: CBPEnrollmentSchedule[] = []
      res.forEach(d => data = data.concat(d.data));
      return data;
    }))
  }

  private getRangedSchedule(range: Interval): Observable<CustomHttpResponse<CBPEnrollmentSchedule[]>> {
    return this.ranges$.find(r => this.rangeEquals(r.range, range))?.obs ?? this.addRange(range)
  }

  private addRange(range: Interval): Observable<CustomHttpResponse<CBPEnrollmentSchedule[]>> {
    const obsRef$ = this.addObs(range)
      this.ranges$.push({ range: range, obs: obsRef$ });
    return obsRef$;
  }

  private addObs(range: Interval): Observable<CustomHttpResponse<CBPEnrollmentSchedule[]>> {
    return this.http.post<CustomHttpResponse<CBPEnrollmentSchedule[]>>(API + "GetScheduleRangeCBP", range).pipe(shareReplay(CACHE_SIZE));
  }


  //add new appointment to the data base
  public addAppointment(data: CBPEnrollmentSchedule): Observable<CustomHttpResponse<any>> {
    this.clearCache()
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterSchedule", data)
  }

  //update al the fields in the appointment
  public updateAppointment(data: CBPEnrollmentSchedule): Observable<CustomHttpResponse<any>> {
    this.clearCache()
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateSchedule", data)
  }

  private rangeEquals(right: Interval, left: Interval): boolean {
    return this.dtService.isSameDay(right.start, left.start) && this.dtService.isSameDay(right.end, left.end)
  }

  public clearCache(): void {
    this.ranges$.forEach(r => r.obs = this.addObs(r.range))
  }
}
