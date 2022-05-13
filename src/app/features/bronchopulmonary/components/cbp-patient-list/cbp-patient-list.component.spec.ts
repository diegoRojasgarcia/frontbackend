import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBPPatientListComponent } from './cbp-patient-list.component';

describe('CBPPatientListComponent', () => {
  let component: CBPPatientListComponent;
  let fixture: ComponentFixture<CBPPatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CBPPatientListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CBPPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
