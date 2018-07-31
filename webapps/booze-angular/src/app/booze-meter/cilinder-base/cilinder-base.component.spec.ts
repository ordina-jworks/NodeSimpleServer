import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CilinderBaseComponent } from './cilinder-base.component';

describe('CilinderBaseComponent', () => {
  let component: CilinderBaseComponent;
  let fixture: ComponentFixture<CilinderBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CilinderBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CilinderBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
