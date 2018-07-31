import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CilinderBeerComponent } from './cilinder-beer.component';

describe('CilinderBeerComponent', () => {
  let component: CilinderBeerComponent;
  let fixture: ComponentFixture<CilinderBeerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CilinderBeerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CilinderBeerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
