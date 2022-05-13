import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCRPatientComponent } from './ccr-patient.component';

describe('CCRPatientComponent', () => {
  let component: CCRPatientComponent;
  let fixture: ComponentFixture<CCRPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CCRPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CCRPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
