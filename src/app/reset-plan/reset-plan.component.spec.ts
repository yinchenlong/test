import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPlanComponent } from './reset-plan.component';

describe('ResetPlanComponent', () => {
  let component: ResetPlanComponent;
  let fixture: ComponentFixture<ResetPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
