import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCRPatientListComponent } from './ccr-patient-list.component';

describe('CCRPatientListComponent', () => {
  let component: CCRPatientListComponent;
  let fixture: ComponentFixture<CCRPatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CCRPatientListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CCRPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
