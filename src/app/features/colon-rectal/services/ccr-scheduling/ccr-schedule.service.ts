import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { CCREnrollmentSchedule } from 'src/app/features/colon-rectal/models/ccr-schedule';
import { CustomHttpResponse } from 'src/app/core/models/http-response';
import { Schedule } from 'src/app/features/scheduling/models/schedule';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { map, shareReplay } from 'rxjs/operators';
import { DateTimeService } from 'src/app/core/services/date-time/date-time.service';
import { RangeCache } from 'src/app/features/scheduling/models/range-cache';

const API: string = AppConstants.CCR_SCHEDULING_API
const CACHE_SIZE = 1;

@Injectable()
export class CCRSchedulingService {
  private ranges$: RangeCache[] = [];

  constructor(private http: HttpClient, private dtService: DateTimeService) { }

  //get all the scheduled appointments
  public getSchedule(): Observable<CustomHttpResponse<CCREnrollmentSchedule[]>> {
    return this.http.get<CustomHttpResponse<CCREnrollmentSchedule[]>>(API + "GetSchedule")
  }

  //get all the appointments in a givven date range (date must be in ISO)
  public getScheduleRange(range: Interval[]): Observable<CCREnrollmentSchedule[]> {
    return forkJoin(range.map(r => this.getRangedSchedule(r))).pipe(map(res => {
      let data: CCREnrollmentSchedule[] = []
      res.forEach(d => data = data.concat(d.data));
      return data;
    }))
  }

  private getRangedSchedule(range: Interval): Observable<CustomHttpResponse<CCREnrollmentSchedule[]>> {
    return this.ranges$.find(r => this.rangeEquals(r.range, range))?.obs ?? this.addRange(range)
  }

  private addRange(range: Interval): Observable<CustomHttpResponse<CCREnrollmentSchedule[]>> {
    const obsRef$ = this.addObs(range)
      this.ranges$.push({ range: range, obs: obsRef$ });
    return obsRef$;
  }

  private addObs(range: Interval): Observable<CustomHttpResponse<CCREnrollmentSchedule[]>> {
    return this.http.post<CustomHttpResponse<CCREnrollmentSchedule[]>>(API + "GetScheduleRangeCCR", range).pipe(shareReplay(CACHE_SIZE));
  }


  //add new appointment to the data base
  public addAppointment(data: CCREnrollmentSchedule): Observable<CustomHttpResponse<any>> {
    this.clearCache()
    return this.http.post<CustomHttpResponse<any>>(API + "RegisterSchedule", data)
  }

  //update al the fields in the appointment
  public updateAppointment(data: Schedule): Observable<CustomHttpResponse<any>> {
    this.clearCache()
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateSchedule", data)
  }

  //update only the patients state
  public updateAppointmentState(data: Schedule): Observable<CustomHttpResponse<any>> {
    return this.http.put<CustomHttpResponse<any>>(API + "UpdateScheduleState", data)
  }

  private rangeEquals(right: Interval, left: Interval): boolean {
    return this.dtService.isSameDay(right.start, left.start) && this.dtService.isSameDay(right.end, left.end)
  }

  public clearCache(): void {
    this.ranges$.forEach(r => r.obs = this.addObs(r.range))
  }
}


