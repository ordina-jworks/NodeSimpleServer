import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoozeMeterComponent } from './booze-meter.component';

describe('BoozeMeterComponent', () => {
  let component: BoozeMeterComponent;
  let fixture: ComponentFixture<BoozeMeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoozeMeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoozeMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
