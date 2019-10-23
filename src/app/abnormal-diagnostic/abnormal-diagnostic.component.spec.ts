import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalDiagnosticComponent } from './abnormal-diagnostic.component';

describe('AbnormalDiagnosticComponent', () => {
  let component: AbnormalDiagnosticComponent;
  let fixture: ComponentFixture<AbnormalDiagnosticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbnormalDiagnosticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalDiagnosticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
