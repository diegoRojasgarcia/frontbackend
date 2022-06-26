import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientCBPReports } from './cbp-reports-component';

describe('ColonRectalSummaryComponent', () => {
  let component: PatientCBPReports;
  let fixture: ComponentFixture<PatientCBPReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientCBPReports ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCBPReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
