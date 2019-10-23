import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetResultTodyComponent } from './reset-result-tody.component';

describe('ResetResultTodyComponent', () => {
  let component: ResetResultTodyComponent;
  let fixture: ComponentFixture<ResetResultTodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetResultTodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetResultTodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
