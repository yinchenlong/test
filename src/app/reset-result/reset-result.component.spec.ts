import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetResultComponent } from './reset-result.component';

describe('ResetResultComponent', () => {
  let component: ResetResultComponent;
  let fixture: ComponentFixture<ResetResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
