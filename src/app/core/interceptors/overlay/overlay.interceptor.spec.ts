import { TestBed } from '@angular/core/testing';

import { OverlayInterceptor } from './overlay.interceptor';

describe('OverlayInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      OverlayInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: OverlayInterceptor = TestBed.inject(OverlayInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
