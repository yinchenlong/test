import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalShowedComponent } from './abnormal-showed.component';

describe('AbnormalShowedComponent', () => {
  let component: AbnormalShowedComponent;
  let fixture: ComponentFixture<AbnormalShowedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbnormalShowedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalShowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
