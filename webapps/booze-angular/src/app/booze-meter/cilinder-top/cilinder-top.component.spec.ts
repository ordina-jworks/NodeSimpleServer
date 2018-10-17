import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CilinderTopComponent } from './cilinder-top.component';

describe('CilinderTopComponent', () => {
  let component: CilinderTopComponent;
  let fixture: ComponentFixture<CilinderTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CilinderTopComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CilinderTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
