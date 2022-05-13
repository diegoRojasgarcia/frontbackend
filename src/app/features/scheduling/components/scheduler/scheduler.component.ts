import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Calendar, CalendarOptions, EventApi, EventClickArg, EventDropArg, FullCalendarComponent } from '@fullcalendar/angular';
import { DateClickArg, EventResizeDoneArg } from '@fullcalendar/interaction';
import { Subscription } from 'rxjs';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { DateTimeService } from 'src/app/core/services/date-time/date-time.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})

export class SchedulerComponent implements OnChanges, AfterViewInit, OnInit, OnDestroy {

  private subs$ = new Subscription();

  @ViewChild("scheduler")
  scheduler!: FullCalendarComponent;
  calendar!: Calendar;

  @Input() cancer = "";

  @Input() events: any[] = [];
  @Output() eventsChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Input() timeRange: Interval[] = [];
  @Output() timeRangeChange: EventEmitter<Interval[]> = new EventEmitter<Interval[]>();

  @Output() editEvent: EventEmitter<EventApi> = new EventEmitter<EventApi>();
  @Output() eventChange: EventEmitter<EventApi> = new EventEmitter<EventApi>();

  @Input() schedulerStart = AppConstants.schedulerStart;
  @Input() schedulerEnd = AppConstants.schedulerEnd;

  @Output() scheduleEvent: EventEmitter<Date> = new EventEmitter<Date>();

  private loadStrat = AppConstants.DEFAULT_LOAD;
  private confirm: boolean = AppConstants.CONFIRM_EVENT_CHANGES;
  private VIEW_MONTH: string = 'dayGridMonth';
  private VIEW_WEEK: string = 'timeGridWeek';
  currentView = AppConstants.schedulerInitialView;

  calendarOptions: CalendarOptions = {
    nowIndicator: true,
    dateClick: this.dateClick.bind(this),
    eventClick: this.eventClick.bind(this),
    eventDrop: this.handleEventChange.bind(this),
    eventResize: this.handleEventChange.bind(this),
    locales: AppConstants.schedulerLocales,
    locale: AppConstants.schedulerLocale,
    hiddenDays: AppConstants.schedulerHiddenDays,
    editable: AppConstants.allowScheduleInteractions,
    firstDay: AppConstants.schedulerFirstDay,
    initialView: this.currentView,
    allDaySlot: AppConstants.schedulerAllDay,
    headerToolbar: {
      start: '', // will normally be on the left. if RTL, will be on the right
      center: 'title',
      end: '' // will normally be on the right. if RTL, will be on the left
    },
    expandRows: true,
    slotMinTime: this.schedulerStart,
    slotMaxTime: this.schedulerEnd,
    events: this.events
  };

  constructor(private DTService: DateTimeService, private confirmDialog: MatDialog) {
  }
  ngOnInit(): void {
    if (!this.timeRange.length) {
      this.changeTimeRange(new Date())
      this.timeRangeChange.emit(this.timeRange);
    }
  }
  ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }
  ngAfterViewInit(): void {

    this.calendar = this.scheduler.getApi();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.schedulerEnd) {
      this.calendarOptions.slotMaxTime = this.schedulerEnd;
    }
    if (changes.schedulerStart) {
      this.calendarOptions.slotMinTime = this.schedulerStart;
    }
    if (changes.events) {
      this.calendarOptions.events = this.events;
    }
  }

  /**
   * Emits date to be handle by a parent component
   * 
   * @param event Event data to be emited.
   */
  dateClick(event: DateClickArg): void {
    this.scheduleEvent.emit(event.date)
  }

  /**
   * Emits event data to be handled by a parent component.
   * 
   * @param event Event data to be emited.
   */
  eventClick(event: EventClickArg): void {
    const eventRef: EventApi = event.event;
    this.editEvent.emit(eventRef);
  }

  /**
   * Handles the changes made by user interaction.
   * 
   * If change is made by resizing or Drag & Drop and the ask for confirmation option is enabled,
   * opens a confirmation dialog asking to confirm the changes, if confirm, the event is modified 
   * and the new values are emited to be handlel by a parent component, otherwise the event is 
   * rolled back to it's previous value.
   * 
   * @param change Changed event, if changed is cancel, the events is returned to it's previous values.
   */
  handleEventChange(change: EventResizeDoneArg | EventDropArg): void {
    if (this.confirm) {
      const options = new MatDialogConfig()
      options.maxWidth = "500px"
      options.data = {
        title: "Confirmar Cambio",
        msg: "¿Seguro desea modificar el evento?",
        action: "Modificar"
      }
      const diaRef = this.confirmDialog.open(ConfirmDialogComponent, options)
      this.subs$.add(diaRef.afterClosed().subscribe(res => {
        if (res.response)
          this.eventChange.emit(change.event);
        else {
          change.event.remove();
          this.calendar.addEvent(change.oldEvent.toPlainObject());
        }
      }))
    }
    else
      this.eventChange.emit(change.event);
  }

  // calendar navigation handling functions.
  prev(): void {
    this.calendar.prev();
    this.changeTimeRange(this.calendar.getDate());
  }
  prevYear(): void {
    this.calendar.prevYear();
    this.changeTimeRange(this.calendar.getDate());
  }
  next(): void {
    this.calendar.next();
    this.changeTimeRange(this.calendar.getDate());
  }
  nextYear(): void {
    this.calendar.nextYear();
    this.changeTimeRange(this.calendar.getDate());
  }

  viewMonth(): void {
    this.currentView = this.VIEW_MONTH;
    this.calendar.changeView(this.currentView);
    this.changeTimeRange(this.calendar.getDate());

  }

  viewWeek(): void {
    this.currentView = this.VIEW_WEEK;
    this.calendar.changeView(this.currentView);
    this.changeTimeRange(this.calendar.getDate());
  }

  today(): void {
    this.calendar.today();
    this.changeTimeRange(this.calendar.getDate());
  }


  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        this.prev();
        break;
      case "ArrowRight":
        this.next();
        break;
      case "Home":
        this.today()
        break;

    }
  }

  /**
   * Determines the current date range that should be loaded.
   * 
   * Gets the time range to be loaded, the range can be modified in the global constants
   * (please verify correct operation before committing any change).
   * 
   * The current loading strategies are the following:
   * <ul>
   * <li>week
   * <li>month (default)
   * </ul>
   * 
   * Any change may imply breaking modification to the current implementation of various
   * related components, so this is highly discouraged.
   * 
   * @param ref Reference date used for range calculation.
   */
  changeTimeRange(ref: Date): void {
    switch (this.loadStrat) {
      case "week":
        if (!this.timeRange.some(r => this.DTService.isSameISOWeek(ref, r.start))) {
          this.timeRange = [this.DTService.getISOWeekRangeDates(ref)];
          this.timeRangeChange.emit(this.timeRange);
        }
        break;
      case "month":
        if (this.currentView !== this.VIEW_MONTH) {
          const weekRef = this.DTService.getISOWeekRangeDates(ref);
          const aux = !this.DTService.isSameMonth(weekRef.start, weekRef.end)
          if (!this.timeRange.length || aux || this.timeRange.some(r => !this.DTService.isSameMonth(weekRef.start, r.end))) {
            this.timeRange = [this.DTService.getMonthRangeDates(weekRef.start)];
            if (aux)
              this.timeRange.push(this.DTService.getMonthRangeDates(weekRef.end))
            this.timeRangeChange.emit(this.timeRange);
          }
        } else {
          this.timeRange = [
            this.DTService.getMonthRangeDates(ref),
            this.DTService.getMonthRangeDates(this.DTService.add(ref, { months: -1 })),
            this.DTService.getMonthRangeDates(this.DTService.add(ref, { months: 1 }))
          ]
          this.timeRangeChange.emit(this.timeRange);
        }
        break;
    };
  }
}

