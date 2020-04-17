import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineBarChartComponent } from './line-bar-chart.component';

describe('LineBarChartComponent', () => {
  let component: LineBarChartComponent;
  let fixture: ComponentFixture<LineBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
