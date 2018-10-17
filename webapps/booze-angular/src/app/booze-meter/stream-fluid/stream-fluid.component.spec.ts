import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamFluidComponent } from './stream-fluid.component';

describe('StreamFluidComponent', () => {
  let component: StreamFluidComponent;
  let fixture: ComponentFixture<StreamFluidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StreamFluidComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamFluidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
