import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetResultExpetComponent } from './reset-result-expet.component';

describe('ResetResultExpetComponent', () => {
  let component: ResetResultExpetComponent;
  let fixture: ComponentFixture<ResetResultExpetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetResultExpetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetResultExpetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
