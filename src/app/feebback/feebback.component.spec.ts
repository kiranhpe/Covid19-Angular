import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeebbackComponent } from './feebback.component';

describe('FeebbackComponent', () => {
  let component: FeebbackComponent;
  let fixture: ComponentFixture<FeebbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeebbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeebbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
