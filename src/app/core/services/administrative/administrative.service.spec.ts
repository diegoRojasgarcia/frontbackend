import { TestBed } from '@angular/core/testing';

import { AdministrativeService } from './administrative.service';

describe('AdministrativeService', () => {
  let service: AdministrativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministrativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
