import { TestBed } from '@angular/core/testing';

import { SpecialityGuard } from './speciality.guard';

describe('SpecialityGuard', () => {
  let guard: SpecialityGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SpecialityGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
