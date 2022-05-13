import { TestBed } from '@angular/core/testing';

import { CBPSchedulingService } from './cbp-scheduling.service';

describe('CBPSchedulingService', () => {
  let service: CBPSchedulingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CBPSchedulingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
