import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualResetComponent } from './manual-reset.component';

describe('ManualResetComponent', () => {
  let component: ManualResetComponent;
  let fixture: ComponentFixture<ManualResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
