import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalShowedExpetComponent } from './abnormal-showed-expet.component';

describe('AbnormalShowedExpetComponent', () => {
  let component: AbnormalShowedExpetComponent;
  let fixture: ComponentFixture<AbnormalShowedExpetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbnormalShowedExpetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalShowedExpetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
