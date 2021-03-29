import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavlineComponent } from './navline.component';

describe('NavlineComponent', () => {
  let component: NavlineComponent;
  let fixture: ComponentFixture<NavlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
