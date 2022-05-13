import { Injectable } from '@angular/core';
import { parseISO, parse, format, add, compareAsc, endOfWeek, startOfWeek, startOfISOWeek, endOfISOWeek, sub, isSameISOWeek, startOfMonth, endOfMonth, isSameMonth, isSameYear, isSameDay } from 'date-fns'
import { AppConstants } from 'src/app/core/constants/app.constants';


interface addOptions {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}
@Injectable({
  providedIn: 'root'
})
export class DateTimeService {
  private UNKNOWN = AppConstants.UNKNOWN
  private formatString = AppConstants.DATE_FORMAT
  constructor() { }
  // format to ISO in local value
  format(date: Date): string {
    return format(date, this.formatString);
  }
  formatDateOnly(date: Date): string {
    return format(date, AppConstants.DATE_ONLY);
  }
  formatViewDate(date: Date | string | undefined | null): string | Date {
    if (!date)
      return this.UNKNOWN
    if (typeof date === 'string')
      return this.formatDateOnly(new Date(date))
    else
      return this.formatDateOnly(date);
  }
  parse(date: string): Date {
    return parse(date, AppConstants.DATE_PARSE, new Date())
  }
  parseISO(date: string): Date {
    return parseISO(date);
  }
  parseDateOnly(date: string): Date {
    return parse(date, AppConstants.DATE_ONLY, new Date())
  }
  add(date: Date | number, options: addOptions): Date {
    return add(date, options);
  }
  sub(date: Date | number, options: addOptions): Date {
    return sub(date, options);
  }
  // compare the first date to the second, returns -1, 0 or 1.
  compareDates(date1: Date, date2: Date): number {
    return compareAsc(date1, date2);
  }

  getISOWeekRangeDates(date: Date): Interval {
    return { start: startOfISOWeek(date), end: endOfISOWeek(date) }
  }
  getWeekRangeDates(date: Date): Interval {
    return { start: startOfWeek(date), end: endOfWeek(date) }
  }

  isSameDay(left: Date | number, right: Date| number): boolean {
    return isSameDay(left, right);
  }

  isSameISOWeek(dateLeft: Date | number, dateRight: Date | number): boolean {
    return isSameISOWeek(dateLeft, dateRight);
  }

  getMonthRangeDates(date: Date | number): Interval {
    return { start: startOfMonth(date), end: endOfMonth(date) }
  }

  isSameMonth(dateLeft: Date | number, dateRight: Date | number): boolean {
    return isSameMonth(dateLeft, dateRight)
  }

  isSameYear(left: Date | number, right: Date | number): boolean {
    return isSameYear(left, right);
  }
}
