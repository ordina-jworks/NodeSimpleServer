import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CilinderFootComponent } from './cilinder-foot.component';

describe('CilinderFootComponent', () => {
  let component: CilinderFootComponent;
  let fixture: ComponentFixture<CilinderFootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CilinderFootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CilinderFootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
