import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColonRectalReportsComponent } from './ccr-reports-component';

describe('ColonRectalSummaryComponent', () => {
  let component: ColonRectalReportsComponent;
  let fixture: ComponentFixture<ColonRectalReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColonRectalReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColonRectalReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
