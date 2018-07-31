import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlassFrontComponent } from './glass-front.component';

describe('GlassFrontComponent', () => {
  let component: GlassFrontComponent;
  let fixture: ComponentFixture<GlassFrontComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlassFrontComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlassFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
