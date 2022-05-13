import { TestBed } from '@angular/core/testing';

import { CCRSchedulingService } from './ccr-schedule.service';

describe('CCRSchedulingService', () => {
  let service: CCRSchedulingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CCRSchedulingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
