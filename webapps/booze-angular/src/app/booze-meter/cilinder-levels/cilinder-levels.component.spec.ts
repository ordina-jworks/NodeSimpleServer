import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CilinderLevelsComponent } from './cilinder-levels.component';

describe('CilinderLevelsComponent', () => {
  let component: CilinderLevelsComponent;
  let fixture: ComponentFixture<CilinderLevelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CilinderLevelsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CilinderLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
