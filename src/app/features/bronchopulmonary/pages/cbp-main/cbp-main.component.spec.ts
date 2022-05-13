import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBPMainComponent } from './cbp-main.component';

describe('CBPMainComponent', () => {
  let component: CBPMainComponent;
  let fixture: ComponentFixture<CBPMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CBPMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CBPMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
