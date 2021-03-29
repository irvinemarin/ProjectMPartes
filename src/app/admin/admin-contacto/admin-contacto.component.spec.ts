import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContactoComponent } from './admin-contacto.component';

describe('AdminSliderComponent', () => {
  let component: AdminContactoComponent;
  let fixture: ComponentFixture<AdminContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminContactoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
