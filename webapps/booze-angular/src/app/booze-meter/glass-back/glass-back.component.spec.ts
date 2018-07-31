import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlassBackComponent } from './glass-back.component';

describe('GlassBackComponent', () => {
  let component: GlassBackComponent;
  let fixture: ComponentFixture<GlassBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlassBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlassBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
