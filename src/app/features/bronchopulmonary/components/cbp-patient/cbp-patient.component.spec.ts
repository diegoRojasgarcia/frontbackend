import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBPPatientComponent } from './cbp-patient.component';

describe('CBPPatientComponent', () => {
  let component: CBPPatientComponent;
  let fixture: ComponentFixture<CBPPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CBPPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CBPPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
