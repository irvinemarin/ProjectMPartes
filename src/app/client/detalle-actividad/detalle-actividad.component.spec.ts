import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleActividadComponent } from './detalle-actividad.component';

describe('DetalleActividadComponent', () => {
  let component: DetalleActividadComponent;
  let fixture: ComponentFixture<DetalleActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleActividadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
