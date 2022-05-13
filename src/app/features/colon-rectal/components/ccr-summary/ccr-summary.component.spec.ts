import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColonRectalSummaryComponent } from './ccr-summary.component';

describe('ColonRectalSummaryComponent', () => {
  let component: ColonRectalSummaryComponent;
  let fixture: ComponentFixture<ColonRectalSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColonRectalSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColonRectalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
