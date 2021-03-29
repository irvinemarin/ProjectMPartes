import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSliderComponent } from './admin-slider.component';

describe('AdminSliderComponent', () => {
  let component: AdminSliderComponent;
  let fixture: ComponentFixture<AdminSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
