import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBPTrackingComponent } from './cbp-tracking.component';

describe('CBPTrackingComponent', () => {
  let component: CBPTrackingComponent;
  let fixture: ComponentFixture<CBPTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CBPTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CBPTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
