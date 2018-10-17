import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CilinderComponent } from './cilinder.component';

describe('CilinderComponent', () => {
  let component: CilinderComponent;
  let fixture: ComponentFixture<CilinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CilinderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CilinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
