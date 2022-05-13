import { TestBed } from '@angular/core/testing';

import { CBPPatientService } from './cbp-patient.service';

describe('CBPPatientService', () => {
  let service: CBPPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CBPPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
