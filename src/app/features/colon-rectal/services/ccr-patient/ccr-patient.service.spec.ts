import { TestBed } from '@angular/core/testing';

import { CCRPatientService } from './ccr-patient.service';

describe('CCRPatientService', () => {
  let service: CCRPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CCRPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
