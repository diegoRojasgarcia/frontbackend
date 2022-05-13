import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCRMainComponent } from './ccr-main.component';

describe('CCRMainComponent', () => {
  let component: CCRMainComponent;
  let fixture: ComponentFixture<CCRMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CCRMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CCRMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
