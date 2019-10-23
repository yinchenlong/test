import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingPlanComponent } from './booking-plan.component';

describe('BookingPlanComponent', () => {
  let component: BookingPlanComponent;
  let fixture: ComponentFixture<BookingPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
