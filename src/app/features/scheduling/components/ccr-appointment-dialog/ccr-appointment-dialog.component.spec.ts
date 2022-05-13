import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCRAppointmentDialogComponent } from './ccr-appointment-dialog.component';

describe('CCRAppointmentDialogComponent', () => {
  let component: CCRAppointmentDialogComponent;
  let fixture: ComponentFixture<CCRAppointmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CCRAppointmentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CCRAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
