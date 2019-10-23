import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueStationComponent } from './residue-station.component';

describe('ResidueStationComponent', () => {
  let component: ResidueStationComponent;
  let fixture: ComponentFixture<ResidueStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResidueStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidueStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
