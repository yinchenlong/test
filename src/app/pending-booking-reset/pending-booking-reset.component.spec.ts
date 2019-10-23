import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingBookingResetComponent } from './pending-booking-reset.component';

describe('PendingBookingResetComponent', () => {
  let component: PendingBookingResetComponent;
  let fixture: ComponentFixture<PendingBookingResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingBookingResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingBookingResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
