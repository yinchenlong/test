import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtsManageComponent } from './bts-manage.component';

describe('BtsManageComponent', () => {
  let component: BtsManageComponent;
  let fixture: ComponentFixture<BtsManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtsManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
